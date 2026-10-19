import { GitHubActivity } from "@/components/landing/github-activity";
import { siteConfig } from "@/config/site";
import { fetchGithubData } from "@/lib/github";
import { buildActivityCalendar } from "@/lib/github-activity";
import { revealOnMount } from "@/lib/motion";
import * as motion from "motion/react-client";

export async function GitHubSection() {
  const contributions = await fetchGithubData(
    siteConfig.personal.githubUsername,
  );

  const calendar = buildActivityCalendar(contributions);
  if (!calendar) {
    return null;
  }

  return (
    <div className="border-t border-dashed p-2">
      <motion.div
        className="no-js-visible"
        {...revealOnMount({ y: 0 })}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <GitHubActivity key={calendar.end} calendar={calendar} />
      </motion.div>
    </div>
  );
}
