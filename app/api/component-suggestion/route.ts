/* Receives component suggestions from the /components catalog dialog, filters
   them (heuristics plus Jev when TYPESAFE_API_KEY is set), and forwards the
   survivors to a Discord webhook. The webhook URL and the TypeSafe key never
   reach the client.

   Moderation rejections answer 200 with a fake success so abusers get no
   signal about what was dropped; only the server log and nothing else knows. */

import { NextResponse } from "next/server";

import { moderateSuggestion } from "@/lib/suggestion-moderation";

const WEBHOOK_URL = process.env.DISCORD_COMPONENT_SUGGESTION_WEBHOOK_URL;

/* Mirrors the caps the dialog enforces client-side. */
const MIN_IDEA_LENGTH = 20;
const MAX_IDEA_LENGTH = 2000;
const MAX_REFERENCES_LENGTH = 2000;
const MAX_NAME_LENGTH = 80;
const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 1_500_000;
/* Vercel caps function request bodies around 4.5 MB; stay under it. */
const MAX_TOTAL_IMAGE_BYTES = 4_000_000;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const NO_STORE = { "Cache-Control": "no-store" } as const;

/* Best-effort per-IP throttle. Serverless instances are ephemeral, so this
   only blunts casual abuse; durable rate limiting would need a store. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 3;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function invalid(message: string) {
  return NextResponse.json(
    { error: "invalid", message },
    { status: 400, headers: NO_STORE }
  );
}

/** Discord needs a plain, predictable filename for `attachment://` refs. */
function sanitizeFilename(name: string, index: number): string {
  const ext = (name.match(/\.(png|jpe?g|webp)$/i)?.[1] ?? "png").toLowerCase();
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image";
  return `suggestion-${index + 1}-${base}.${ext === "jpeg" ? "jpg" : ext}`;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: NO_STORE }
    );
  }

  if (!WEBHOOK_URL) {
    return NextResponse.json(
      { error: "unavailable" },
      { status: 503, headers: NO_STORE }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return invalid("The submission could not be read. Try again.");
  }

  const idea = String(form.get("idea") ?? "").trim();
  const references = String(form.get("references") ?? "")
    .trim()
    .slice(0, MAX_REFERENCES_LENGTH);
  const name = String(form.get("name") ?? "")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
  const honeypot = String(form.get("website") ?? "");

  if (honeypot) {
    /* A bot filled the hidden field. Fake success, deliver nothing. */
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  }

  if (idea.length < MIN_IDEA_LENGTH || idea.length > MAX_IDEA_LENGTH) {
    return invalid(
      `Describe the component in ${MIN_IDEA_LENGTH} to ${MAX_IDEA_LENGTH} characters.`
    );
  }

  const rawFiles = form
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (rawFiles.length > MAX_IMAGES) {
    return invalid("Up to 3 images are allowed.");
  }

  const images: { file: File; filename: string }[] = [];
  let totalBytes = 0;
  for (const [index, file] of rawFiles.entries()) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return invalid("Images must be PNG, JPG, or WebP.");
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return invalid("Each image must be under 1.5 MB.");
    }
    totalBytes += file.size;
    if (totalBytes > MAX_TOTAL_IMAGE_BYTES) {
      return invalid("Images must total under 4 MB.");
    }
    images.push({ file, filename: sanitizeFilename(file.name, index) });
  }

  const verdict = await moderateSuggestion({ idea, references, name });
  if (verdict.action === "reject") {
    console.warn(
      `component-suggestion: dropped (${verdict.reason}) ${verdict.summary}`
    );
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  }

  /* Preserve the whole submission in Discord. Embed fields are capped at 1024
     characters, so using an attachment avoids silently losing long ideas or
     reference lists while keeping the embed scannable. */
  const submissionFile = new File(
    [
      [
        "Component suggestion",
        "",
        `Idea:\n${idea}`,
        "",
        `References:\n${references || "None"}`,
        "",
        `From:\n${name || "Anonymous"}`,
        "",
        `Filter:\n${verdict.summary}`,
      ].join("\n"),
    ],
    "component-suggestion.txt",
    { type: "text/plain" }
  );

  const attachments = [
    { id: 0, filename: submissionFile.name, description: "Full submission" },
    ...images.map(({ filename }, index) => ({
      id: index + 1,
      filename,
      description: "Reference image",
    })),
  ];

  const payload = {
    username: "component suggestions",
    embeds: [
      {
        title: "New component suggestion",
        color: 0x0ea5e9,
        fields: [
          { name: "Idea", value: idea.slice(0, 1024) },
          {
            name: "References",
            value: references ? references.slice(0, 1024) : "None",
          },
          { name: "From", value: name || "Anonymous" },
          { name: "Filter", value: verdict.summary.slice(0, 1024) },
        ],
        footer: { text: "akoder.xyz/components" },
        timestamp: new Date().toISOString(),
        ...(images.length > 0
          ? { image: { url: `attachment://${images[0].filename}` } }
          : {}),
      },
    ],
    ...(images.length > 0
      ? { image: { url: `attachment://${images[0].filename}` } }
      : {}),
    attachments,
  };

  const body = new FormData();
  body.append("payload_json", JSON.stringify(payload));
  body.append("files[0]", submissionFile, submissionFile.name);
  images.forEach(({ file, filename }, index) => {
    body.append(`files[${index + 1}]`, file, filename);
  });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      signal: controller.signal,
      body,
    }).finally(() => clearTimeout(timeout));

    if (response.status === 429) {
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: NO_STORE }
      );
    }

    if (!response.ok) {
      console.error(
        `component-suggestion: discord responded ${response.status}`,
        await response.text().catch(() => "")
      );
      return NextResponse.json(
        { error: "network" },
        { status: 502, headers: NO_STORE }
      );
    }

    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch (error) {
    console.error("component-suggestion:", error);
    return NextResponse.json(
      { error: "network" },
      { status: 502, headers: NO_STORE }
    );
  }
}
