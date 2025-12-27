import { describe, test, expect, afterEach } from "bun:test";
import { rm } from "fs/promises";
import { join } from "path";
import { ProjectGenerator } from "./generator";
import type { ScaffoldConfig } from "./config";

describe("ProjectGenerator", () => {
  const testDir = join(import.meta.dir, "../../.test-output");
  let projectPath: string;

  const createConfig = (name: string): ScaffoldConfig => ({
    projectName: name,
    outputPath: join(testDir, name),
    frontend: { framework: "react", styling: "tailwind", dataFetching: "tanstack-query" },
    backend: { framework: "elysia" },
    features: [],
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  test("generates complete project structure", async () => {
    const config = createConfig("test-structure");
    projectPath = config.outputPath;
    
    const generator = new ProjectGenerator();
    (generator as any).installDependencies = async () => {};
    (generator as any).initGit = async () => {};

    await generator.generate(config);

    // Frontend
    expect(await Bun.file(join(projectPath, "frontend/package.json")).exists()).toBe(true);
    expect(await Bun.file(join(projectPath, "frontend/index.html")).exists()).toBe(true);
    expect(await Bun.file(join(projectPath, "frontend/vite.config.ts")).exists()).toBe(true);
    expect(await Bun.file(join(projectPath, "frontend/src/App.tsx")).exists()).toBe(true);
    expect(await Bun.file(join(projectPath, "frontend/src/main.tsx")).exists()).toBe(true);

    // Backend
    expect(await Bun.file(join(projectPath, "backend/package.json")).exists()).toBe(true);
    expect(await Bun.file(join(projectPath, "backend/src/index.ts")).exists()).toBe(true);

    // Root
    expect(await Bun.file(join(projectPath, "README.md")).exists()).toBe(true);
    expect(await Bun.file(join(projectPath, ".gitignore")).exists()).toBe(true);
  });

  test("substitutes projectName in templates", async () => {
    const config = createConfig("my-cool-app");
    projectPath = config.outputPath;

    const generator = new ProjectGenerator();
    (generator as any).installDependencies = async () => {};
    (generator as any).initGit = async () => {};

    await generator.generate(config);

    const indexHtml = await Bun.file(join(projectPath, "frontend/index.html")).text();
    expect(indexHtml).toContain("<title>my-cool-app</title>");

    const readme = await Bun.file(join(projectPath, "README.md")).text();
    expect(readme).toContain("# my-cool-app");

    const backendIndex = await Bun.file(join(projectPath, "backend/src/index.ts")).text();
    expect(backendIndex).toContain("my-cool-app");
  });

  test("generated package.json files are valid JSON", async () => {
    const config = createConfig("test-json");
    projectPath = config.outputPath;

    const generator = new ProjectGenerator();
    (generator as any).installDependencies = async () => {};
    (generator as any).initGit = async () => {};

    await generator.generate(config);

    const frontendPkg = await Bun.file(join(projectPath, "frontend/package.json")).json();
    expect(frontendPkg.name).toBe("test-json-frontend");
    expect(frontendPkg.dependencies).toBeDefined();

    const backendPkg = await Bun.file(join(projectPath, "backend/package.json")).json();
    expect(backendPkg.name).toBe("test-json-backend");
    expect(backendPkg.dependencies).toBeDefined();
  });
});
