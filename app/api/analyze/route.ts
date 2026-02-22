import { NextRequest, NextResponse } from "next/server";
import { createGitHubService } from "@/lib/github";
import { createGeminiService } from "@/lib/gemini";
import { parseGitHubUrl } from "@/lib/utils";
import { generateId } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { url, apiKey, githubToken, model } = await request.json();

    if (!url || !apiKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const { owner, repo } = parsed;
    const github = createGitHubService(githubToken);
    const gemini = createGeminiService(apiKey, model);

    // Get repo info
    const repoInfo = await github.getRepoInfo(owner, repo);

    // Get repository content summary
    const contentSummary = await github.getRepoContentSummary(owner, repo, repoInfo.defaultBranch);

    // Generate summary
    const summary = await gemini.generateSummary(contentSummary);

    // Generate diagrams
    const diagrams = {
      architecture: await gemini.generateDiagram("architecture", contentSummary),
      hierarchy: await gemini.generateDiagram("hierarchy", contentSummary),
      dataFlow: await gemini.generateDiagram("dataFlow", contentSummary),
      classDiagram: await gemini.generateDiagram("class", contentSummary),
      dependencyGraph: await gemini.generateDiagram("dependency", contentSummary),
      mindmap: await gemini.generateDiagram("mindmap", contentSummary),
    };

    // Generate code health
    const codeHealth = await gemini.analyzeCodeHealth(contentSummary);

    const analysis = {
      id: generateId(),
      repo: repoInfo,
      summary: summary.summary,
      architecture: summary.architecture,
      techStack: summary.techStack,
      diagrams,
      fileInsights: [],
      modules: [],
      codeHealth,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
  }
}
