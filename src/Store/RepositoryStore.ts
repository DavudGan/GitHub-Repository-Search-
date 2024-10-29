import { makeAutoObservable, runInAction } from "mobx";

const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_TOKEN = ''//import.meta.env.VITE_REACT_APP_GITHUB_TOKEN;

interface LicenseInfo {
  name: string | null;
}

interface PrimaryLanguage {
  name: string | null;
}

export interface Repository {
  id: string;
  name: string;
  stargazerCount: number;
  updatedAt: string;
  description: string | null;
  primaryLanguage: PrimaryLanguage | null;
  licenseInfo: LicenseInfo | null;
}

interface Edge {
  node: Repository;
}

interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface GitHubAPIResponse {
  data: {
    search: {
      edges: Edge[];
      pageInfo: PageInfo;
    };
  };
}

class RepositoryStore {
  repositories: Repository[] = [];
  loading = false;
  error: string | null = null;
  endCursor: string | null = null;
  hasNextPage = true;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchRepositories(searchTerm: string) {
    if (this.loading || !this.hasNextPage) return;
    this.loading = true;
    this.error = null;

    const query = `
      query ($searchTerm: String!, $after: String) {
        search(query: $searchTerm, type: REPOSITORY, first: 20, after: $after) {
          edges {
            node {
              ... on Repository {
                id
                name
                stargazerCount
                updatedAt
                description
                primaryLanguage {
                  name
                }
                licenseInfo {
                  name
                }
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `;

    try {
      const response = await fetch(GITHUB_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
          query,
          variables: { searchTerm, after: this.endCursor },
        }),
      });

      const result: GitHubAPIResponse = await response.json();
      const { edges, pageInfo } = result.data.search;

      runInAction(() => {
        this.repositories.push(...edges.map((edge: Edge) => edge.node));
        this.endCursor = pageInfo.endCursor;
        this.hasNextPage = pageInfo.hasNextPage;
      });
      console.log("ds");
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }


  delete(item: Repository) {
    this.repositories = this.repositories.filter((repo) => repo.id !== item.id);
  }

  edit(item: Repository, name:string, description:string){
    const idItem = this.repositories.findIndex(repo => repo.id === item.id);
    if (idItem !== -1) {
      this.repositories[idItem].description = description;
      this.repositories[idItem].name = name;
    }
  }
}

const repositoryStore = new RepositoryStore();
export default repositoryStore;
