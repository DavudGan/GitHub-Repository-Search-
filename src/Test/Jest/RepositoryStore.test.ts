import repositoryStore, { Repository, GitHubAPIResponse } from "../../Store/RepositoryStore";

describe("RepositoryStore", () => {
  beforeEach(() => {
    repositoryStore.repositories = [];
    repositoryStore.loading = false;
    repositoryStore.error = null;
    repositoryStore.endCursor = null;
    repositoryStore.hasNextPage = true;
  });

  const mockFetch = (response: GitHubAPIResponse) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(response),
      })
    ) as jest.Mock;
  };

  test("Загрука репозиториев", async () => {
    const mockResponse: GitHubAPIResponse = {
      data: {
        search: {
          edges: [
            {
              node: {
                id: "1",
                name: "Repo 1",
                stargazerCount: 10,
                updatedAt: "2024-10-01",
                description: "Test repository 1",
                primaryLanguage: { name: "JavaScript" },
                licenseInfo: { name: "MIT" },
              },
            },
          ],
          pageInfo: {
            endCursor: "abc123",
            hasNextPage: true,
          },
        },
      },
    };

    mockFetch(mockResponse);

    await repositoryStore.fetchRepositories("react");

    expect(repositoryStore.repositories).toHaveLength(1);
    expect(repositoryStore.repositories[0].name).toBe("Repo 1");
    expect(repositoryStore.endCursor).toBe("abc123");
    expect(repositoryStore.hasNextPage).toBe(true);
  });

  test("Ошибка загрузки", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Fetch error"))
    ) as jest.Mock;

    await repositoryStore.fetchRepositories("react");

    expect(repositoryStore.error).toBe("Fetch error");
    expect(repositoryStore.loading).toBe(false);
  });

  test("Удаление репозитория", () => {
    const repo: Repository = {
      id: "1",
      name: "Repo 1",
      stargazerCount: 10,
      updatedAt: "2024-10-01",
      description: "Test repository 1",
      primaryLanguage: { name: "JavaScript" },
      licenseInfo: { name: "MIT" },
    };

    repositoryStore.repositories.push(repo);
    expect(repositoryStore.repositories).toHaveLength(1);

    repositoryStore.delete(repo);

    expect(repositoryStore.repositories).toHaveLength(0);
  });

  test("Редактирование репозитория", () => {
    const repo: Repository = {
      id: "1",
      name: "Repo 1",
      stargazerCount: 10,
      updatedAt: "2024-10-01",
      description: "Test repository 1",
      primaryLanguage: { name: "JavaScript" },
      licenseInfo: { name: "MIT" },
    };

    repositoryStore.repositories.push(repo);
    expect(repositoryStore.repositories[0].name).toBe("Repo 1");

    repositoryStore.edit(repo, "Updated Repo", "Updated description");

    expect(repositoryStore.repositories[0].name).toBe("Updated Repo");
    expect(repositoryStore.repositories[0].description).toBe(
      "Updated description"
    );
  });
});