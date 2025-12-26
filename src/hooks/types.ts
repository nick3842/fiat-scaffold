export interface HookContext {
  projectName: string;
  projectPath: string;
  frontendPath: string;
  backendPath: string;
}

export interface Hook {
  id: string;
  name: string;
  description: string;
  // Either a script string or a function that returns the script
  script: string | ((ctx: HookContext) => string);
  // If true, the hook takes over the terminal (like tmux attach)
  // and should run after the TUI exits
  takesOverTerminal?: boolean;
}

export interface HookResult {
  success: boolean;
  error?: string;
}
