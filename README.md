# CodeAtlas

## Description

CodeAtlas is an AI-powered tool that analyzes GitHub repositories and provides comprehensive insights including architecture diagrams, code health analysis, and an interactive chat interface for exploring codebases.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Framer Motion
- **State Management**: Zustand
- **Diagrams**: Mermaid
- **AI**: Google Gemini API (@google/generative-ai)
- **GitHub API**: Octokit, simple-git

## Features

- **Repository Analysis**: Fetch and analyze any public or private GitHub repository
- **AI-Powered Summaries**: Generate intelligent summaries of codebase structure and purpose
- **Architecture Diagrams**: Automatically generate multiple diagram types using Mermaid syntax:
  - Architecture diagrams
  - Hierarchy diagrams
  - Data flow diagrams
  - Class diagrams
  - Dependency graphs
  - Mind maps
- **Code Health Analysis**: Evaluate code quality and identify potential issues
- **Interactive File Tree**: Navigate repository structure with an expandable file tree
- **Chat Interface**: Ask questions about the codebase and receive AI-powered responses
- **Streaming Responses**: Real-time streaming of AI responses for chat interactions

## Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Gemini API key (get one from Google AI Studio)
- GitHub Personal Access Token (optional, for private repositories)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd code-atlas

# Install dependencies
npm install

# or using yarn
yarn install
```

## Configuration

Create a `.env.local` file in the root directory:

```env
# Required: Your Gemini API key from Google AI Studio
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: GitHub token for private repositories
GITHUB_TOKEN=your_github_token_here
```

### Getting API Keys

**Gemini API Key**:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy it to your `.env.local`

**GitHub Token** (for private repos):
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a classic token with `repo` scope
3. Copy it to your `.env.local`

## Usage

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open the application**:
   Navigate to `http://localhost:3000`

3. **Analyze a repository**:
   - Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`)
   - Click "Analyze" to start the analysis
   - Wait for the AI to generate summaries, diagrams, and health analysis

4. **Explore the analysis**:
   - View the repository summary and tech stack
   - Browse generated architecture diagrams
   - Navigate the file tree
   - Check code health metrics

5. **Chat about the codebase**:
   - Use the chat panel to ask specific questions
   - Get contextual answers based on the repository analysis

## API Routes

### POST /api/analyze

Analyzes a GitHub repository and returns comprehensive insights.

**Request Body**:
```json
{
  "url": "https://github.com/owner/repo",
  "apiKey": "gemini_api_key",
  "githubToken": "optional_github_token",
  "model": "gemini-1.5-flash"
}
```

**Response**:
```json
{
  "id": "analysis_id",
  "repo": {
    "owner": "...",
    "name": "...",
    "fullName": "...",
    "description": "...",
    "stars": 0,
    "forks": 0,
    "language": "...",
    "topics": [],
    "url": "...",
    "defaultBranch": "main"
  },
  "summary": "...",
  "architecture": "...",
  "techStack": [],
  "diagrams": {
    "architecture": "mermaid_syntax",
    "hierarchy": "mermaid_syntax",
    "dataFlow": "mermaid_syntax",
    "classDiagram": "mermaid_syntax",
    "dependencyGraph": "mermaid_syntax",
    "mindmap": "mermaid_syntax"
  },
  "codeHealth": {
    "overall": "good",
    "score": 80,
    "issues": [],
    "suggestions": []
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/chat

Chat with AI about an analyzed repository. Returns streaming responses.

**Headers**:
```
x-api-key: your_gemini_api_key
x-model: gemini-1.5-flash
```

**Request Body**:
```json
{
  "message": "How is authentication handled in this repo?",
  "history": [
    { "role": "user", "content": "What is the tech stack?" },
    { "role": "assistant", "content": "This repo uses React and Node.js" }
  ],
  "repoContext": {
    "summary": "...",
    "techStack": ["React", "Node.js"],
    "architecture": "..."
  }
}
```

**Response**: Server-Sent Events (SSE) stream

## Project Structure

```
code-atlas/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts       # Repository analysis endpoint
│   │   └── chat/
│   │       └── route.ts       # Chat endpoint
│   ├── dashboard/
│   │   └── page.tsx           # Main dashboard UI
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── dashboard/
│   │   ├── chat-panel.tsx     # Chat interface
│   │   ├── diagram-viewer.tsx # Mermaid diagram renderer
│   │   └── file-tree.tsx      # Repository file tree
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── constants.ts           # App constants
│   ├── gemini.ts              # Gemini AI service
│   ├── github.ts              # GitHub API service
│   └── utils.ts               # Utility functions
├── hooks/
│   ├── useDebounce.ts         # Debounce hook
│   └── useKeyboardShortcuts.ts
├── store/
│   └── index.ts               # Zustand state management
├── types/
│   └── index.ts               # TypeScript definitions
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Architecture

CodeAtlas works in three main stages:

1. **Repository Fetching**:
   - Uses Octokit to fetch repository metadata (stars, forks, language, etc.)
   - Recursively fetches the file tree, respecting size limits
   - Downloads key configuration files (package.json, README.md, etc.)
   - Skips directories like `node_modules`, `.git`, `dist`, etc.

2. **AI Analysis**:
   - Sends repository content to Gemini AI
   - Generates structured summaries and insights
   - Creates Mermaid diagram syntax for visualizations
   - Analyzes code health and quality

3. **Interactive Exploration**:
   - Displays results in an interactive dashboard
   - Renders Mermaid diagrams in real-time
   - Provides chat interface for follow-up questions
   - Streams AI responses for responsive UX

## License

MIT
