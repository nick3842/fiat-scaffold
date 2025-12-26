import { mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { TemplateEngine } from "./template-engine.ts";
import { embeddedTemplates } from "./embedded-templates.ts";
import { frameworkRegistry } from "../frameworks/index.ts";
import { featureRegistry } from "../features/index.ts";
import type { ScaffoldConfig } from "./config.ts";

export interface GenerationProgress {
  phase: "setup" | "frontend" | "backend" | "features" | "install" | "finalize";
  message: string;
  progress: number; // 0-100
}

export type ProgressCallback = (progress: GenerationProgress) => void;

export class ProjectGenerator {
  private templateEngine: TemplateEngine;

  constructor() {
    this.templateEngine = new TemplateEngine();
  }

  async generate(
    config: ScaffoldConfig,
    onProgress?: ProgressCallback
  ): Promise<void> {
    const outputPath = config.outputPath;

    // Phase 1: Setup base structure
    onProgress?.({
      phase: "setup",
      message: "Creating project structure...",
      progress: 10,
    });
    await this.createBaseStructure(outputPath);

    // Phase 2: Generate frontend
    onProgress?.({
      phase: "frontend",
      message: "Generating frontend...",
      progress: 30,
    });
    await this.generateFrontend(config, outputPath);

    // Phase 3: Generate backend
    onProgress?.({
      phase: "backend",
      message: "Generating backend...",
      progress: 50,
    });
    await this.generateBackend(config, outputPath);

    // Phase 4: Apply features
    onProgress?.({
      phase: "features",
      message: "Applying features...",
      progress: 60,
    });
    await this.applyFeatures(config, outputPath);

    // Phase 5: Install dependencies
    onProgress?.({
      phase: "install",
      message: "Installing frontend dependencies...",
      progress: 70,
    });
    await this.installDependencies(outputPath, "frontend");

    onProgress?.({
      phase: "install",
      message: "Installing backend dependencies...",
      progress: 85,
    });
    await this.installDependencies(outputPath, "backend");

    // Phase 6: Finalize
    onProgress?.({
      phase: "finalize",
      message: "Finalizing project...",
      progress: 95,
    });
    await this.finalize(config, outputPath);

    onProgress?.({ phase: "finalize", message: "Done!", progress: 100 });
  }

  private async createBaseStructure(outputPath: string): Promise<void> {
    await mkdir(join(outputPath, "frontend", "src"), { recursive: true });
    await mkdir(join(outputPath, "backend", "src"), { recursive: true });
  }

  private async generateFrontend(
    config: ScaffoldConfig,
    outputPath: string
  ): Promise<void> {
    const adapter = frameworkRegistry.getFrontend(config.frontend.framework);
    if (!adapter) throw new Error(`Unknown frontend: ${config.frontend.framework}`);

    const context = {
      projectName: config.projectName,
      ...adapter.getTemplateVariables(config),
    };

    // Process templates
    await this.templateEngine.processDirectory(
      adapter.templateDir,
      join(outputPath, "frontend"),
      context
    );

    // Generate package.json with feature dependencies merged
    const featureDeps = this.collectFeatureDependencies(config, "frontend");
    const featureDevDeps = this.collectFeatureDevDependencies(config, "frontend");
    const featureScripts = this.collectFeatureScripts(config, "frontend");

    await this.generatePackageJson(
      join(outputPath, "frontend"),
      `${config.projectName}-frontend`,
      { ...adapter.dependencies, ...featureDeps },
      { ...adapter.devDependencies, ...featureDevDeps },
      { ...adapter.scripts, ...featureScripts }
    );
  }

  private async generateBackend(
    config: ScaffoldConfig,
    outputPath: string
  ): Promise<void> {
    const adapter = frameworkRegistry.getBackend(config.backend.framework);
    if (!adapter) throw new Error(`Unknown backend: ${config.backend.framework}`);

    const context = {
      projectName: config.projectName,
      ...adapter.getTemplateVariables(config),
    };

    // Process templates
    await this.templateEngine.processDirectory(
      adapter.templateDir,
      join(outputPath, "backend"),
      context
    );

    // Generate package.json with feature dependencies merged
    const featureDeps = this.collectFeatureDependencies(config, "backend");
    const featureDevDeps = this.collectFeatureDevDependencies(config, "backend");
    const featureScripts = this.collectFeatureScripts(config, "backend");

    await this.generatePackageJson(
      join(outputPath, "backend"),
      `${config.projectName}-backend`,
      { ...adapter.dependencies, ...featureDeps },
      { ...adapter.devDependencies, ...featureDevDeps },
      { ...adapter.scripts, ...featureScripts }
    );
  }

  private collectFeatureDependencies(
    config: ScaffoldConfig,
    target: "frontend" | "backend"
  ): Record<string, string> {
    const deps: Record<string, string> = {};

    for (const featureConfig of config.features) {
      if (!featureConfig.enabled) continue;
      const feature = featureRegistry.get(featureConfig.name);
      if (!feature) continue;

      const featureDeps = feature.dependencies[target];
      if (featureDeps) {
        Object.assign(deps, featureDeps);
      }
    }

    return deps;
  }

  private collectFeatureDevDependencies(
    config: ScaffoldConfig,
    target: "frontend" | "backend"
  ): Record<string, string> {
    const deps: Record<string, string> = {};

    for (const featureConfig of config.features) {
      if (!featureConfig.enabled) continue;
      const feature = featureRegistry.get(featureConfig.name);
      if (!feature || !feature.devDependencies) continue;

      const featureDeps = feature.devDependencies[target];
      if (featureDeps) {
        Object.assign(deps, featureDeps);
      }
    }

    return deps;
  }

  private collectFeatureScripts(
    config: ScaffoldConfig,
    target: "frontend" | "backend"
  ): Record<string, string> {
    const scripts: Record<string, string> = {};

    for (const featureConfig of config.features) {
      if (!featureConfig.enabled) continue;
      const feature = featureRegistry.get(featureConfig.name);
      if (!feature || !feature.scripts) continue;

      const featureScripts = feature.scripts[target];
      if (featureScripts) {
        Object.assign(scripts, featureScripts);
      }
    }

    return scripts;
  }

  private async applyFeatures(
    config: ScaffoldConfig,
    _outputPath: string
  ): Promise<void> {
    // Features are applied via template variables and dependencies
    // Additional feature-specific file generation can be added here
    for (const featureConfig of config.features) {
      if (!featureConfig.enabled) continue;
      const feature = featureRegistry.get(featureConfig.name);
      if (!feature || !feature.templateDir) continue;

      // If the feature has templates, process them
      // (Currently features work via template variables in base templates)
    }
  }

  private async generatePackageJson(
    dir: string,
    name: string,
    deps: Record<string, string>,
    devDeps: Record<string, string>,
    scripts: Record<string, string>
  ): Promise<void> {
    const pkg = {
      name,
      version: "0.0.1",
      private: true,
      type: "module",
      scripts,
      dependencies: deps,
      devDependencies: devDeps,
    };

    await mkdir(dirname(join(dir, "package.json")), { recursive: true });
    await writeFile(join(dir, "package.json"), JSON.stringify(pkg, null, 2));
  }

  private async installDependencies(
    outputPath: string,
    target: "frontend" | "backend"
  ): Promise<void> {
    const cwd = join(outputPath, target);
    const proc = Bun.spawn(["bun", "install"], {
      cwd,
      stdout: "ignore",
      stderr: "ignore",
    });
    await proc.exited;
    
    if (proc.exitCode !== 0) {
      throw new Error(`Failed to install ${target} dependencies`);
    }
  }

  private async finalize(
    config: ScaffoldConfig,
    outputPath: string
  ): Promise<void> {
    // Generate root README
    const readme = `# ${config.projectName}

Full-stack TypeScript application built with:
- **Frontend**: ${config.frontend.framework === "react" ? "React" : "SolidJS"} + Vite + Tailwind CSS v4 + TanStack Query
- **Backend**: Elysia on Bun

## Project Structure

\`\`\`
${config.projectName}/
├── frontend/    # ${config.frontend.framework === "react" ? "React" : "SolidJS"} frontend application
└── backend/     # Elysia backend API
\`\`\`

## Getting Started

### Install Dependencies

\`\`\`bash
# Frontend
cd frontend && bun install

# Backend
cd ../backend && bun install
\`\`\`

### Development

\`\`\`bash
# Start frontend dev server (http://localhost:5173)
cd frontend && bun dev

# Start backend dev server (http://localhost:3001)
cd backend && bun dev
\`\`\`

## Features

${config.features.filter((f) => f.enabled).length > 0 ? config.features.filter((f) => f.enabled).map((f) => `- ${f.name}`).join("\n") : "No additional features enabled."}
`;

    await writeFile(join(outputPath, "README.md"), readme);
  }
}
