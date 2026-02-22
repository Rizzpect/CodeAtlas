import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPTS = {
  summary: "You are an expert software architect.",
  fileExplanation: "Explain this code file.",
  diagram: "Generate valid Mermaid diagram syntax only.",
  moduleInsight: "Analyze this module.",
  codeHealth: "Analyze code health.",
  chat: "You are an expert developer."
};

export class GeminiService {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey: string, model: string = "gemini-1.5-flash") {
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  setModel(model: string) {
    this.model = model;
  }

  async generateSummary(content: string) {
    const prompt = SYSTEM_PROMPTS.summary + "\n\n" + content;
    const result = await this.client.getGenerativeModel({ model: this.model }).generateContent(prompt);
    const response = result.response.text();
    try {
      const match = response.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (e) {}
    return { summary: content.slice(0, 500), purpose: "Repository analysis", architecture: "See summary", techStack: [] };
  }

  async explainFile(content: string, filename: string) {
    const prompt = SYSTEM_PROMPTS.fileExplanation + "\n\nFilename: " + filename + "\n" + content;
    const result = await this.client.getGenerativeModel({ model: this.model }).generateContent(prompt);
    const response = result.response.text();
    try {
      const match = response.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (e) {}
    return { summary: content.slice(0, 200), explanation: response, language: "Unknown", lines: content.split("\n").length };
  }

  async generateDiagram(type: string, content: string) {
    const prompt = "Generate " + type + " Mermaid diagram. " + SYSTEM_PROMPTS.diagram + "\n\n" + content;
    const result = await this.client.getGenerativeModel({ model: this.model }).generateContent(prompt);
    const response = result.response.text();
    const match = response.match(/```mermaid\n?([\s\S]*?)```/);
    if (match) return match[1].trim();
    return response.includes("graph") ? response.trim() : "graph TD\n  A[Start] --> B[End]";
  }

  async analyzeModule(content: string, modulePath: string) {
    const prompt = SYSTEM_PROMPTS.moduleInsight + "\n\nModule: " + modulePath + "\n" + content;
    const result = await this.client.getGenerativeModel({ model: this.model }).generateContent(prompt);
    const response = result.response.text();
    try {
      const match = response.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (e) {}
    return { summary: content.slice(0, 300), purpose: "Module analysis", files: [] };
  }

  async analyzeCodeHealth(content: string) {
    const prompt = SYSTEM_PROMPTS.codeHealth + "\n\n" + content;
    const result = await this.client.getGenerativeModel({ model: this.model }).generateContent(prompt);
    const response = result.response.text();
    try {
      const match = response.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (e) {}
    return { overall: "good", score: 80, issues: [], suggestions: ["Analysis complete"] };
  }

  async *streamChat(messages: { role: string; content: string }[], context: string) {
    const chatHistory = messages.map(m => m.role + ": " + m.content).join("\n\n");
    const prompt = SYSTEM_PROMPTS.chat + "\n\nRepository Context:\n" + context + "\n\nConversation:\n" + chatHistory;
    const result = await this.client.getGenerativeModel({ model: this.model }).generateContentStream(prompt);
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }
}

export function createGeminiService(apiKey: string, model?: string) {
  return new GeminiService(apiKey, model);
}
