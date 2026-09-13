import { getVisitorCount } from "@/lib/visitor-count";
import { VisitorCounterOdometer } from "@/components/landing/visitor-counter-odometer";

/* Server-fetched so the count ships in the HTML behind a Suspense boundary
   instead of arriving late from a client-side request. */
export async function VisitorCounter() {
  const visitors = await getVisitorCount();
  if (visitors === null) return null;
  return <VisitorCounterOdometer visitors={visitors} />;
}
