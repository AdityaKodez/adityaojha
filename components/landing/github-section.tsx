import { GitHubActivity } from "@/components/landing/github-activity";
import { githubSectionConfig } from "@/config/github";
import { siteConfig } from "@/config/site";
import { fetchGithubData } from "@/lib/github/github";
import { buildActivityCalendar } from "@/lib/github/github-activity";

export async function GitHubSection() {
  const contributions = await fetchGithubData(
    siteConfig.personal.githubUsername,
  );

  const calendar = buildActivityCalendar(
    contributions,
    githubSectionConfig.minWeeks,
  );
  if (!calendar) {
    return null;
  }

  return (
    <div className="border-t border-dashed p-2">
      <GitHubActivity key={calendar.end} calendar={calendar} />
    </div>
  );
}
