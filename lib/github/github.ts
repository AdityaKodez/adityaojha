import "server-only";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const QUERY = `
  query($username: String!, $after: String, $includeCalendar: Boolean!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar @include(if: $includeCalendar) {
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
        repositoryContributions(first: 100, after: $after) {
          nodes {
            occurredAt
            isRestricted
            repository {
              name
              nameWithOwner
              stargazerCount
              visibility
              isFork
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`;

export type NewRepository = {
  name: string;
  stars: number;
};

export type Contribution = {
  date: string;
  count: number;
  newRepositories?: NewRepository[];
};

type RepositoryContribution = {
  occurredAt: string;
  isRestricted: boolean;
  repository: {
    name: string;
    nameWithOwner: string;
    stargazerCount: number;
    visibility: string;
    isFork: boolean;
  };
};

type ContributionsCollection = {
  contributionCalendar?: {
    weeks: {
      contributionDays: {
        date: string;
        contributionCount: number;
      }[];
    }[];
  };
  repositoryContributions?: {
    nodes: (RepositoryContribution | null)[] | null;
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  } | null;
};

type GitHubGraphQLResponse = {
  errors?: unknown[];
  data?: {
    user?: {
      contributionsCollection?: ContributionsCollection;
    } | null;
  };
};

async function fetchContributionsPage(
  username: string,
  token: string,
  after: string | null = null,
) {
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
        variables: { username, after, includeCalendar: after === null },
      }),
      cache: "force-cache",
      // Match analytics freshness instead of regenerating the homepage each minute.
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error("GitHub API request failed:", response.status);
      return null;
    }

    const json: GitHubGraphQLResponse = await response.json();

    if (json.errors?.length) {
      console.error("GitHub API returned GraphQL errors.");
    }

    return json.data?.user?.contributionsCollection ?? null;
  } catch (error) {
    console.error("GitHub API request failed.", error);
    return null;
  }
}

export async function fetchGithubData(username: string): Promise<Contribution[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is missing");
  }

  const firstPage = await fetchContributionsPage(username, token);
  const weeks = firstPage?.contributionCalendar?.weeks;
  if (!firstPage || !weeks?.length) return [];

  const repositoriesByDate = new Map<string, Map<string, NewRepository>>();
  const cursors = new Set<string>();
  let repositories = firstPage.repositoryContributions;

  while (repositories) {
    for (const contribution of repositories.nodes ?? []) {
      const repository = contribution?.repository;
      if (
        contribution?.isRestricted !== false ||
        repository?.visibility !== "PUBLIC" ||
        repository.isFork !== false ||
        !repository.name ||
        !Number.isSafeInteger(repository.stargazerCount) ||
        repository.stargazerCount < 0
      ) {
        continue;
      }

      const timestamp = Date.parse(contribution.occurredAt);
      if (!Number.isFinite(timestamp)) {
        console.error("GitHub returned an invalid repository contribution date.");
        continue;
      }

      const date = new Date(timestamp).toISOString().slice(0, 10);
      const entry: NewRepository = {
        name: repository.name,
        stars: repository.stargazerCount,
      };
      const repos = repositoriesByDate.get(date);
      if (repos) {
        repos.set(repository.nameWithOwner, entry);
      } else {
        repositoriesByDate.set(
          date,
          new Map([[repository.nameWithOwner, entry]]),
        );
      }
    }

    const { hasNextPage, endCursor } = repositories.pageInfo;
    if (!hasNextPage) break;
    if (!endCursor || cursors.has(endCursor)) {
      console.error("GitHub returned an invalid repository contribution cursor.");
      break;
    }
    cursors.add(endCursor);
    repositories = (await fetchContributionsPage(username, token, endCursor))
      ?.repositoryContributions;
  }

  return weeks.flatMap((week) =>
    week.contributionDays.map((day) => {
      const repos = repositoriesByDate.get(day.date);
      return {
        date: day.date,
        count: day.contributionCount,
        ...(repos && {
          newRepositories: [...repos.values()].sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        }),
      };
    }),
  );
}
