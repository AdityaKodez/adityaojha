import { Suspense } from "react";
import { InsightsChart } from "@/components/landing/insights-chart";
import { InsightsSummary } from "@/components/landing/insights-summary";
import { insightsConfig } from "@/config/insights";
import { getInsights } from "@/lib/insights";

async function InsightsContent() {
  const report = await getInsights();

  if (!report) {
    return (
      <p
        role="status"
        className="flex h-54 items-center justify-center px-6 text-sm text-muted-foreground"
      >
        {insightsConfig.unavailable}
      </p>
    );
  }

  return (
    <>
      <InsightsSummary summary={report.summary} previous={report.previous} />
      <InsightsChart points={report.points} />
    </>
  );
}

export function Insights() {
  return (
    <section
      aria-labelledby="insights-heading"
      className="border-t border-dashed pt-6"
    >
      <h2 id="insights-heading" className="section-heading">
        {insightsConfig.title}
      </h2>
      <Suspense
        fallback={
          <div
            role="status"
            aria-label={insightsConfig.loading}
            className="mt-2.5 h-[367px] border-y border-border motion-safe:animate-pulse sm:h-[272px]"
          >
            <div className="blueprint-bg h-[175px] opacity-50 sm:h-20" />
          </div>
        }
      >
        <InsightsContent />
      </Suspense>
    </section>
  );
}
