/* Persistence for the sponsor pipeline: commits sponsor data and logos to
   the repo through the GitHub Contents API. The deploy that follows the
   push is what makes a new seat visible, so every commit must land on the
   branch Vercel builds from. Without SPONSOR_GITHUB_TOKEN every call here
   returns null/false and the routes degrade instead of throwing. */

import "server-only";

import type { Sponsor } from "@/config/types";

const TOKEN = process.env.SPONSOR_GITHUB_TOKEN;
const OWNER = process.env.SPONSOR_REPO_OWNER ?? "AdityaKodez";
const REPO = process.env.SPONSOR_REPO_NAME ?? "adityaojha";
const BRANCH = "main";
const SPONSORS_JSON_PATH = "config/sponsors.generated.json";
const LOGO_DIR = "public/sponsors";

const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

function isConfigured() {
  return Boolean(TOKEN);
}

async function githubFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  return fetch(`${API_BASE}/${path}`, {
    ...init,
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  }).finally(() => clearTimeout(timeout));
}

/** Reads the generated sponsors JSON plus the sha needed to update it. */
async function readSponsorsFile(): Promise<{
  sponsors: Sponsor[];
  sha: string | undefined;
} | null> {
  if (!isConfigured()) return null;

  try {
    const response = await githubFetch(
      `${SPONSORS_JSON_PATH}?ref=${BRANCH}`,
    );

    if (response.status === 404) return { sponsors: [], sha: undefined };
    if (!response.ok) return null;

    const body = (await response.json()) as {
      sha?: string;
      content?: string;
    };

    const decoded = Buffer.from(body.content ?? "", "base64").toString(
      "utf-8",
    );
    const sponsors = JSON.parse(decoded) as Sponsor[];
    return Array.isArray(sponsors)
      ? { sponsors, sha: body.sha }
      : null;
  } catch {
    return null;
  }
}

/** PUTs one file; `sha` must be present when the file already exists. */
async function putFile(
  path: string,
  contentBase64: string,
  sha: string | undefined,
  message: string,
): Promise<boolean> {
  const response = await githubFetch(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  return response.ok;
}

/** Re-reads the current sha and retries once; another writer may have
    committed between our read and our write. */
async function putFileWithRetry(
  path: string,
  contentBase64: string,
  staleSha: string | undefined,
  message: string,
): Promise<boolean> {
  if (await putFile(path, contentBase64, staleSha, message)) return true;

  try {
    const response = await githubFetch(`${path}?ref=${BRANCH}`);
    if (!response.ok) return false;

    const { sha } = (await response.json()) as { sha?: string };
    return await putFile(path, contentBase64, sha, message);
  } catch {
    return false;
  }
}

export interface NewSponsorInput {
  paymentId: string;
  name: string;
  date: string;
}

/**
 * Appends a paid sponsor to the generated file and commits it. Returns
 * "committed", "duplicate" (already recorded, treat as success) or null on
 * any failure, in which case the caller should error so Dodo retries.
 */
export async function commitSponsor(
  input: NewSponsorInput,
): Promise<"committed" | "duplicate" | null> {
  const file = await readSponsorsFile();
  if (!file) return null;

  if (file.sponsors.some((s) => s.paymentId === input.paymentId)) {
    return "duplicate";
  }

  const takenSeats = new Set(file.sponsors.map((s) => s.seat));
  let seat = 0;
  while (takenSeats.has(seat)) seat += 1;

  const entry: Sponsor = {
    id: input.paymentId,
    name: input.name,
    date: input.date,
    seat,
    order: file.sponsors.length + 1,
    enabled: true,
    paymentId: input.paymentId,
    claimed: false,
  };

  const next = [...file.sponsors, entry];
  const committed = await putFileWithRetry(
    SPONSORS_JSON_PATH,
    Buffer.from(JSON.stringify(next, null, 2)).toString("base64"),
    file.sha,
    `Add sponsor seat for ${input.name}`,
  );

  return committed ? "committed" : null;
}

export type ClaimPatch = {
  name?: string;
  url?: string;
  logo?: string;
};

export type ClaimResult =
  | "committed"
  | "not-found"
  | "already-claimed"
  | null;

export type ResolvedClaim =
  | { paymentId: string }
  | "not-found"
  | "already-claimed"
  | null;

/**
 * Picks the first candidate payment that has an unclaimed seat in the
 * generated file. Used by the claim route to turn "the email I paid with"
 * into a concrete payment id without exposing any payment data.
 */
export async function resolveClaimablePayment(
  candidates: string[],
): Promise<ResolvedClaim> {
  const file = await readSponsorsFile();
  if (!file) return null;

  for (const paymentId of candidates) {
    const entry = file.sponsors.find((s) => s.paymentId === paymentId);
    if (entry && !entry.claimed) return { paymentId };
  }

  const anyKnown = candidates.some((paymentId) =>
    file.sponsors.some((s) => s.paymentId === paymentId),
  );
  return anyKnown ? "already-claimed" : "not-found";
}

/** Patches a paid sponsor with the claim-form fields and commits. */
export async function commitSponsorClaim(
  paymentId: string,
  patch: ClaimPatch,
): Promise<ClaimResult> {
  const file = await readSponsorsFile();
  if (!file) return null;

  const entry = file.sponsors.find((s) => s.paymentId === paymentId);
  if (!entry) return "not-found";
  if (entry.claimed) return "already-claimed";

  const next = file.sponsors.map((s) =>
    s.paymentId === paymentId
      ? { ...s, ...patch, claimed: true }
      : s,
  );

  const committed = await putFileWithRetry(
    SPONSORS_JSON_PATH,
    Buffer.from(JSON.stringify(next, null, 2)).toString("base64"),
    file.sha,
    `Claim sponsor seat for ${patch.name ?? entry.name}`,
  );

  return committed ? "committed" : null;
}

const LOGO_EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
} as const;

export function logoExtension(contentType: string): string | null {
  return LOGO_EXTENSIONS[contentType as keyof typeof LOGO_EXTENSIONS] ?? null;
}

/** Commits the uploaded logo and returns its public src path. */
export async function commitLogo(
  paymentId: string,
  bytes: Buffer,
  contentType: string,
): Promise<string | null> {
  const ext = logoExtension(contentType);
  if (!ext) return null;

  const path = `${LOGO_DIR}/${paymentId}.${ext}`;
  const committed = await putFileWithRetry(
    path,
    bytes.toString("base64"),
    undefined,
    `Add sponsor logo for ${paymentId}`,
  );

  return committed ? `/sponsors/${paymentId}.${ext}` : null;
}
