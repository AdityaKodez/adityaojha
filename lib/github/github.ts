import "server-only";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

export type Contribution = {
  date: string;
  count: number;
};

type GitHubGraphQLResponse = {
  errors?: unknown;
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks?: {
            contributionDays: {
              date: string;
              contributionCount: number;
            }[];
          }[];
        };
      };
    };
  };
};

export async function fetchGithubData(
  username: string,
): Promise<Contribution[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is missing");
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        // GitHub defaults to the last year through now. Keep the body stable
        // so each render reuses the same cache entry instead of timestamping it.
        variables: { username },
      }),
      cache: "force-cache",
      // Match analytics freshness instead of regenerating the homepage each minute.
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error("GitHub API request failed:", response.status);
      return [];
    }

    const json: GitHubGraphQLResponse = await response.json();

    if (json.errors) {
      console.error("GitHub API Errors:", json.errors);
      return [];
    }

    const weeks =
      json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ??
      [];

    return weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    );
  } catch {
    console.error("GitHub API request failed.");
    return [];
  }
}
