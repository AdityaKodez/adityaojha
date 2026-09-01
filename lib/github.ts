const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const QUERY = `
  query($username: String!, $from: DateTime, $to: DateTime) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
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

  const now = new Date();
  const from = new Date(now);
  from.setFullYear(now.getFullYear() - 1);

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          username,
          from: from.toISOString(),
          to: now.toISOString(),
        },
      }),
      next: { revalidate: 60 },
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
