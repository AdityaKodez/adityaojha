import { buildLlmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

const CACHE =
  "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": CACHE,
    },
  });
}
