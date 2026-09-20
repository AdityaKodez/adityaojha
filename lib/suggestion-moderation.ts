/**
 * Moderation gate for component suggestions.
 *
 * Two layers, cheapest first:
 *
 * 1. Deterministic heuristics, always on. Catches link dumps, spam
 *    vocabulary, and keyboard mashing without a network call.
 * 2. Jev, TypeSafe's System One model, when TYPESAFE_API_KEY is set. Two
 *    noul judgments over the same state: is this spam, and is it actionable.
 *
 * The gate fails open. Discord is the human review surface and the model is
 * a noise filter, not a security boundary, so if Jev is unreachable the
 * suggestion still gets delivered.
 */

import "server-only";

export type ModerationVerdict = {
  action: "allow" | "reject";
  reason?: "spam" | "low_quality";
  /** Line surfaced in the Discord embed so thresholds can be tuned on real traffic. */
  summary: string;
};

/* Jev thresholds. Starting points, not laws; adjust against the Filter field
   that lands in Discord. */
const SPAM_THRESHOLD = 0.6;
const ACTIONABLE_THRESHOLD = 0.4;

const SPAM_WORD_RE =
  /(casino|crypto\s*(pump|signal|invest)|viagra|escort|backlink|seo\s*services|buy\s*followers|telegram\s*channel|onlyfans|discount\s*code|whatsapp\s*group)/i;
const URL_RE = /https?:\/\/\S+/gi;
const CHAR_RUN_RE = /(.)\1{6,}/;

const JEV_ENDPOINT = "https://api.typesafe.ai/v1/systemone";
const JEV_MODEL = "jev-latest";
const JEV_TIMEOUT_MS = 8000;

export async function moderateSuggestion(input: {
  idea: string;
  references: string;
  name: string;
}): Promise<ModerationVerdict> {
  const heuristic = heuristicCheck(input);
  if (heuristic) return heuristic;

  const jev = await judgeWithJev(input);
  if (jev) return jev;

  return {
    action: "allow",
    summary: "Heuristic checks only (no TYPESAFE_API_KEY)",
  };
}

/** Returns a rejecting verdict, or null when the text passes. */
function heuristicCheck(input: {
  idea: string;
  references: string;
}): ModerationVerdict | null {
  const { idea, references } = input;
  const combined = `${idea}\n${references}`;

  if (SPAM_WORD_RE.test(combined)) {
    return { action: "reject", reason: "spam", summary: "Heuristic: spam vocabulary" };
  }

  const urlCount = combined.match(URL_RE)?.length ?? 0;
  if (urlCount > 6) {
    return { action: "reject", reason: "spam", summary: `Heuristic: ${urlCount} links` };
  }

  if (CHAR_RUN_RE.test(combined)) {
    return { action: "reject", reason: "spam", summary: "Heuristic: character runs" };
  }

  const words = idea.toLowerCase().match(/[a-z]{3,}/g) ?? [];
  const counts = new Map<string, number>();
  for (const word of words) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  for (const count of counts.values()) {
    if (count > 8) {
      return { action: "reject", reason: "spam", summary: "Heuristic: word repetition" };
    }
  }

  const letters = idea.replace(/[^a-z]/gi, "");
  const uppercase = idea.replace(/[^A-Z]/g, "");
  if (letters.length >= 40 && uppercase.length / letters.length > 0.85) {
    return { action: "reject", reason: "spam", summary: "Heuristic: shouting" };
  }

  return null;
}

/**
 * Asks Jev to judge the submission. Returns null when the key is absent or
 * the call fails, which the caller treats as "no opinion" (fail open).
 */
async function judgeWithJev(input: {
  idea: string;
  references: string;
  name: string;
}): Promise<ModerationVerdict | null> {
  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(JEV_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: JEV_MODEL,
        state: {
          context:
            "A visitor is suggesting a UI component for a shadcn-style component registry website.",
          idea: input.idea,
          references: input.references,
          submitter: input.name,
        },
        questions: {
          is_spam: {
            type: "noul",
            instructions:
              "Is this submission spam, advertising, or abuse rather than a genuine request for a new UI component?",
            criteria: {
              true: "Promotional content, link dumping, gibberish, or an attempt to misuse the form",
              false: "A genuine, human-written component request",
            },
          },
          is_actionable: {
            type: "noul",
            instructions:
              "Does the submission describe a concrete, buildable UI component with enough detail to evaluate?",
            criteria: {
              true: "Names a component type or behavior a developer could build and evaluate",
              false: "Too vague, empty, or unrelated to UI components to act on",
            },
          },
        },
      }),
      signal: AbortSignal.timeout(JEV_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(
        `component-suggestion: jev responded ${response.status}, allowing`
      );
      return null;
    }

    const data = (await response.json()) as {
      answers?: {
        is_spam?: { noul?: number };
        is_actionable?: { noul?: number };
      };
    };

    const spam = data.answers?.is_spam?.noul;
    const actionable = data.answers?.is_actionable?.noul;
    if (typeof spam !== "number" || typeof actionable !== "number") return null;

    const summary = `Jev: spam ${spam.toFixed(2)}, actionable ${actionable.toFixed(2)}`;
    if (spam >= SPAM_THRESHOLD) {
      return { action: "reject", reason: "spam", summary };
    }
    if (actionable < ACTIONABLE_THRESHOLD) {
      return { action: "reject", reason: "low_quality", summary };
    }
    return { action: "allow", summary };
  } catch (error) {
    console.error("component-suggestion: jev moderation failed, allowing", error);
    return null;
  }
}
