import type { ScaffoldConfig } from "../core/config.ts";

export interface FeatureModule {
  /** Unique identifier */
  id: string;

  /** Display name for TUI */
  displayName: string;

  /** Description shown in feature selection */
  description: string;

  /** Which parts of the stack this feature affects */
  affects: ("frontend" | "backend")[];

  /** Additional dependencies */
  dependencies: {
    frontend?: Record<string, string>;
    backend?: Record<string, string>;
  };

  /** Additional dev dependencies */
  devDependencies?: {
    frontend?: Record<string, string>;
    backend?: Record<string, string>;
  };

  /** Additional scripts */
  scripts?: {
    frontend?: Record<string, string>;
    backend?: Record<string, string>;
  };

  /** Template files directory for this feature */
  templateDir?: string;

  /** Get template variables */
  getTemplateVariables(config: ScaffoldConfig): Record<string, unknown>;
}
