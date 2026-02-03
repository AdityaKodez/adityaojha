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
  level: 0 | 1 | 2 | 3 | 4;
};

export async function fetchGithubData(
  username: string,
): Promise<Contribution[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("GITHUB_TOKEN is missing, using mock data");
    const mockNow = new Date();
    const mockFrom = new Date(mockNow);
    mockFrom.setFullYear(mockNow.getFullYear() - 1);
    const mockDays: { date: string; count: number }[] = [];
    let currentMockDate = new Date(mockFrom);
    while (currentMockDate <= mockNow) {
      mockDays.push({
        date: currentMockDate.toISOString().split("T")[0],
        count: Math.floor(Math.random() * 5), // Reduced random count for realism
      });
      currentMockDate.setDate(currentMockDate.getDate() + 1);
    }
    return mockDays.map((day) => ({
      ...day,
      level: getIntensityLevel(day.count),
    }));
  }

  const now = new Date();
  const from = new Date(now);
  from.setFullYear(now.getFullYear() - 1);

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
    next: { revalidate: 60 }, // Cache for 60 seconds for fresher data
  });

  const json = await response.json();

  if (json.errors) {
    console.error("GitHub API Errors:", json.errors);
    return [];
  }

  const weeks =
    json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

  const days: { date: string; count: number }[] = [];

  // Flatten weeks into days
  weeks.forEach(
    (week: {
      contributionDays: { date: string; contributionCount: number }[];
    }) => {
      week.contributionDays.forEach((day) => {
        days.push({
          date: day.date,
          count: day.contributionCount,
        });
      });
    },
  );

  // Normalize and color bucket
  return days.map((day) => ({
    ...day,
    level: getIntensityLevel(day.count),
  }));
}

function getIntensityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 11) return 3;
  return 4;
}
