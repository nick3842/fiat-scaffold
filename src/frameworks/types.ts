import type { ScaffoldConfig } from "../core/config.ts";

export interface FrameworkAdapter {
  /** Unique identifier for the framework */
  id: string;

  /** Display name for TUI */
  displayName: string;

  /** Description shown in selection */
  description: string;

  /** Framework type */
  type: "frontend" | "backend";

  /** Dependencies to add to package.json */
  dependencies: Record<string, string>;

  /** Dev dependencies to add */
  devDependencies: Record<string, string>;

  /** Template directory name within templates/ */
  templateDir: string;

  /** Scripts to add to package.json */
  scripts: Record<string, string>;

  /** Whether this framework is available (false for coming soon) */
  available: boolean;

  /** Optional: post-generation hooks */
  postGenerate?: (config: ScaffoldConfig, outputPath: string) => Promise<void>;

  /** Get template variables for this framework */
  getTemplateVariables(config: ScaffoldConfig): Record<string, unknown>;
}
