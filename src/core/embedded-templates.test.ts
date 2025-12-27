import { describe, test, expect } from "bun:test";
import { embeddedTemplates } from "./embedded-templates";
import { frameworkRegistry } from "../frameworks/index";

describe("embedded templates", () => {
  test("frontend/react templates exist", () => {
    const react = embeddedTemplates["frontend/react"];
    expect(react).toBeDefined();
    expect(react!.length).toBeGreaterThan(0);
  });

  test("backend/elysia templates exist", () => {
    const elysia = embeddedTemplates["backend/elysia"];
    expect(elysia).toBeDefined();
    expect(elysia!.length).toBeGreaterThan(0);
  });

  test("frontend/react has required files", () => {
    const react = embeddedTemplates["frontend/react"]!;
    const paths = react.map((f) => f.path);

    expect(paths).toContain("index.html");
    expect(paths).toContain("vite.config.ts");
    expect(paths).toContain("src/main.tsx");
    expect(paths).toContain("src/App.tsx");
  });

  test("backend/elysia has required files", () => {
    const elysia = embeddedTemplates["backend/elysia"]!;
    const paths = elysia.map((f) => f.path);

    expect(paths).toContain("src/index.ts");
    expect(paths).toContain("tsconfig.json");
  });

  test("all templates have non-empty content", () => {
    for (const [framework, files] of Object.entries(embeddedTemplates)) {
      for (const file of files) {
        expect(file.content.length, `${framework}/${file.path} is empty`).toBeGreaterThan(0);
      }
    }
  });

  test("conditional blocks are balanced", () => {
    for (const [framework, files] of Object.entries(embeddedTemplates)) {
      for (const file of files) {
        const ifOpens = (file.content.match(/\{\{#if\s+\w+\}\}/g) || []).length;
        const ifCloses = (file.content.match(/\{\{\/if\}\}/g) || []).length;
        expect(ifOpens, `${framework}/${file.path} has unbalanced {{#if}}`).toBe(ifCloses);

        const unlessOpens = (file.content.match(/\{\{#unless\s+\w+\}\}/g) || []).length;
        const unlessCloses = (file.content.match(/\{\{\/unless\}\}/g) || []).length;
        expect(unlessOpens, `${framework}/${file.path} has unbalanced {{#unless}}`).toBe(unlessCloses);
      }
    }
  });

  test("all registered frameworks have embedded templates", () => {
    const frontends = frameworkRegistry.getFrontendOptions();
    const backends = frameworkRegistry.getBackendOptions();

    for (const frontend of frontends) {
      if (frontend.available) {
        expect(
          embeddedTemplates[frontend.templateDir],
          `Missing templates for frontend: ${frontend.id}`
        ).toBeDefined();
      }
    }

    for (const backend of backends) {
      if (backend.available) {
        expect(
          embeddedTemplates[backend.templateDir],
          `Missing templates for backend: ${backend.id}`
        ).toBeDefined();
      }
    }
  });
});
