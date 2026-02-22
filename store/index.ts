import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  AnalysisState, 
  ChatState, 
  SettingsState, 
  RepoAnalysis, 
  ChatMessage,
  AnalysisProgress,
  FileNode 
} from '@/types';

interface AppStore {
  analysis: AnalysisState;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setProgress: (progress: AnalysisProgress | null) => void;
  setAnalysis: (analysis: RepoAnalysis | null) => void;
  setError: (error: string | null) => void;
  clearAnalysis: () => void;

  chat: ChatState;
  addMessage: (message: ChatMessage) => void;
  addMessages: (messages: ChatMessage[]) => void;
  updateLastMessage: (content: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  clearChat: () => void;

  settings: SettingsState;
  setApiKey: (key: string) => void;
  setModel: (model: SettingsState['model']) => void;
  setGithubToken: (token: string) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;

  fileTree: FileNode[];
  setFileTree: (tree: FileNode[]) => void;
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
  expandAll: () => void;
  collapseAll: () => void;

  chatPanelOpen: boolean;
  setChatPanelOpen: (open: boolean) => void;
  toggleChatPanel: () => void;

  currentDiagram: string | null;
  setCurrentDiagram: (diagram: string | null) => void;
  diagramHistory: string[];
  addToDiagramHistory: (diagram: string) => void;
}

const initialAnalysisState: AnalysisState = {
  isAnalyzing: false,
  progress: null,
  currentAnalysis: null,
  error: null,
};

const initialChatState: ChatState = {
  messages: [],
  isStreaming: false,
};

const initialSettingsState: SettingsState = {
  apiKey: '',
  model: 'gemini-1.5-flash',
  githubToken: '',
};

function getAllFolderPaths(nodes: FileNode[]): string[] {
  const paths: string[] = [];
  
  function traverse(node: FileNode) {
    if (node.type === 'directory') {
      paths.push(node.path);
      node.children?.forEach(traverse);
    }
  }
  
  nodes.forEach(traverse);
  return paths;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      analysis: initialAnalysisState,
      setAnalyzing: (isAnalyzing) =>
        set((state) => ({
          analysis: { ...state.analysis, isAnalyzing },
        })),
      setProgress: (progress) =>
        set((state) => ({
          analysis: { ...state.analysis, progress },
        })),
      setAnalysis: (analysis) =>
        set((state) => ({
          analysis: { ...state.analysis, currentAnalysis: analysis, isAnalyzing: false },
        })),
      setError: (error) =>
        set((state) => ({
          analysis: { ...state.analysis, error, isAnalyzing: false },
        })),
      clearAnalysis: () =>
        set({
          analysis: initialAnalysisState,
          chat: initialChatState,
          fileTree: [],
          currentDiagram: null,
          diagramHistory: [],
        }),

      chat: initialChatState,
      addMessage: (message) =>
        set((state) => ({
          chat: { ...state.chat, messages: [...state.chat.messages, message] },
        })),
      addMessages: (messages) =>
        set((state) => ({
          chat: { ...state.chat, messages: [...state.chat.messages, ...messages] },
        })),
      updateLastMessage: (content) =>
        set((state) => {
          const messages = [...state.chat.messages];
          if (messages.length > 0) {
            messages[messages.length - 1] = {
              ...messages[messages.length - 1],
              content,
            };
          }
          return { chat: { ...state.chat, messages } };
        }),
      setStreaming: (isStreaming) =>
        set((state) => ({
          chat: { ...state.chat, isStreaming },
        })),
      clearChat: () => set({ chat: initialChatState }),

      settings: initialSettingsState,
      setApiKey: (apiKey) =>
        set((state) => ({
          settings: { ...state.settings, apiKey },
        })),
      setModel: (model) =>
        set((state) => ({
          settings: { ...state.settings, model },
        })),
      setGithubToken: (githubToken) =>
        set((state) => ({
          settings: { ...state.settings, githubToken },
        })),

      activeTab: 'overview',
      setActiveTab: (activeTab) => set({ activeTab }),
      sidebarCollapsed: false,
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      selectedFile: null,
      setSelectedFile: (selectedFile) => set({ selectedFile }),

      fileTree: [],
      setFileTree: (fileTree) => set({ fileTree }),
      expandedFolders: new Set<string>(),
      toggleFolder: (path) =>
        set((state) => {
          const newExpanded = new Set(state.expandedFolders);
          if (newExpanded.has(path)) {
            newExpanded.delete(path);
          } else {
            newExpanded.add(path);
          }
          return { expandedFolders: newExpanded };
        }),
      expandAll: () => {
        const { fileTree } = get();
        const allPaths = getAllFolderPaths(fileTree);
        set({ expandedFolders: new Set(allPaths) });
      },
      collapseAll: () => set({ expandedFolders: new Set() }),

      chatPanelOpen: false,
      setChatPanelOpen: (chatPanelOpen) => set({ chatPanelOpen }),
      toggleChatPanel: () =>
        set((state) => ({ chatPanelOpen: !state.chatPanelOpen })),

      currentDiagram: null,
      setCurrentDiagram: (currentDiagram) => set({ currentDiagram }),
      diagramHistory: [],
      addToDiagramHistory: (diagram) =>
        set((state) => ({
          diagramHistory: [...state.diagramHistory.slice(-19), diagram],
        })),
    }),
    {
      name: 'code-atlas-storage',
      partialize: (state) => ({ 
        settings: state.settings,
        sidebarCollapsed: state.sidebarCollapsed,
        expandedFolders: Array.from(state.expandedFolders),
      }),
      merge: (persisted: unknown, current) => {
        const p = persisted as { 
          settings?: SettingsState; 
          sidebarCollapsed?: boolean;
          expandedFolders?: string[];
        } | undefined;
        return {
          ...current,
          settings: p?.settings ?? current.settings,
          sidebarCollapsed: p?.sidebarCollapsed ?? current.sidebarCollapsed,
          expandedFolders: new Set(p?.expandedFolders ?? []),
        };
      },
    }
  )
);
