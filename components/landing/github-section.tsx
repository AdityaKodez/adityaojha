import { GitHubCalendar } from "@/components/ui/github-map";
import { siteConfig } from "@/config/site";
import { fetchGithubData } from "@/lib/github";

export async function GitHubSection() {
  const contributions = await fetchGithubData(
    siteConfig.personal.githubUsername,
  );

  if (contributions.length === 0) {
    return null;
  }

  // GitHubCalendar is a bare registry component, so the home page's section
  // rule belongs here rather than in the published component.
  return (
    <div className="border-t border-dashed">
      <GitHubCalendar data={contributions} />
    </div>
  );
}
