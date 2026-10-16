import { GitHubCalendar } from "@/components/ui/github-map";
import { siteConfig } from "@/config/site";
import { fetchGithubData } from "@/lib/github";
import { revealOnMount } from "@/lib/motion";
import * as motion from "motion/react-client";

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
      <motion.div
        className="no-js-visible"
        {...revealOnMount({ y: 0 })}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <GitHubCalendar data={contributions} />
      </motion.div>
    </div>
  );
}
