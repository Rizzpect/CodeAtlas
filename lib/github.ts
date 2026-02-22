import { Octokit } from "@octokit/rest";
import simpleGit from "simple-git";

const SKIP_DIRS = ["node_modules", ".git", "dist", "build", ".next", "coverage", "__pycache__", "vendor", "target", ".venv"];
const SKIP_FILES = [".DS_Store", "Thumbs.db", ".env.local", ".env.development"];
const MAX_FILE_SIZE = 500 * 1024;

export interface FileInfo {
  path: string;
  name: string;
  type: "file" | "directory";
  size?: number;
  content?: string;
}

export class GitHubService {
  private octokit: Octokit | null = null;

  constructor(token?: string) {
    if (token) {
      this.octokit = new Octokit({ auth: token });
    }
  }

  async getRepoInfo(owner: string, repo: string) {
    const octokit = this.octokit || new Octokit();
    const response = await octokit.repos.get({ owner, repo });
    return {
      owner: response.data.owner.login,
      name: response.data.name,
      fullName: response.data.full_name,
      description: response.data.description,
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      language: response.data.language,
      topics: response.data.topics || [],
      url: response.data.html_url,
      defaultBranch: response.data.default_branch,
    };
  }

  async getFileTree(owner: string, repo: string, branch: string = "main"): Promise<FileInfo[]> {
    const octokit = this.octokit || new Octokit();
    const tree: FileInfo[] = [];

    async function fetchTree(owner: string, repo: string, path: string = "") {
      try {
        const response = await octokit.repos.getContent({ owner, repo, path });
        const contents = Array.isArray(response.data) ? response.data : [response.data];
        for (const item of contents) {
          if (!item) continue;
          const name = item.name || "";
          if (SKIP_DIRS.includes(name) || SKIP_FILES.includes(name)) continue;
          if (item.type === "dir") {
            tree.push({ path: item.path || "", name, type: "directory" });
            await fetchTree(owner, repo, item.path || "");
          } else if (item.type === "file") {
            const size = item.size || 0;
            if (size <= MAX_FILE_SIZE) {
              tree.push({ path: item.path || "", name, type: "file", size });
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching ${path}:`, error);
      }
    }

    await fetchTree(owner, repo);
    return tree;
  }

  async getFileContent(owner: string, repo: string, filePath: string): Promise<string> {
    const octokit = this.octokit || new Octokit();
    try {
      const response = await octokit.repos.getContent({ owner, repo, path: filePath });
      if ("content" in response.data && response.data.content) {
        const content = Buffer.from(response.data.content, "base64").toString("utf-8");
        return content;
      }
      return "";
    } catch (error) {
      console.error(`Error fetching file ${filePath}:`, error);
      return "";
    }
  }

  async getRepoContentSummary(owner: string, repo: string, branch: string = "main"): Promise<string> {
    const tree = await this.getFileTree(owner, repo, branch);
    const summary: string[] = [];
    summary.push("Repository Structure:");
    summary.push(tree.map(t => t.type === "directory" ? t.path + "/" : t.path).join("\n"));

    const keyFiles = ["README.md", "package.json", "requirements.txt", "pyproject.toml", "Cargo.toml", "go.mod"];
    for (const file of keyFiles) {
      const fileInfo = tree.find(t => t.name === file);
      if (fileInfo) {
        const content = await this.getFileContent(owner, repo, fileInfo.path);
        if (content) {
          summary.push("\n--- " + file + " ---\n" + content.slice(0, 5000));
        }
      }
    }
    return summary.join("\n");
  }
}

export function createGitHubService(token?: string) {
  return new GitHubService(token);
}
