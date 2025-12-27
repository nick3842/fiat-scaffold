import { describe, test, expect } from "bun:test";
import { TemplateEngine } from "./template-engine";

describe("TemplateEngine", () => {
  const engine = new TemplateEngine();

  describe("variable interpolation", () => {
    test("replaces {{variable}} with value", () => {
      const result = engine.process("Hello {{projectName}}", {
        projectName: "my-app",
      });
      expect(result).toBe("Hello my-app");
    });

    test("replaces multiple variables", () => {
      const result = engine.process("{{projectName}} by {{author}}", {
        projectName: "my-app",
        author: "nick",
      });
      expect(result).toBe("my-app by nick");
    });

    test("replaces missing variable with empty string", () => {
      const result = engine.process("Hello {{missing}}", {
        projectName: "my-app",
      });
      expect(result).toBe("Hello ");
    });
  });

  describe("{{#if}} conditionals", () => {
    test("includes content when condition is truthy", () => {
      const result = engine.process("{{#if hasAuth}}auth enabled{{/if}}", {
        projectName: "my-app",
        hasAuth: true,
      });
      expect(result).toBe("auth enabled");
    });

    test("excludes content when condition is falsy", () => {
      const result = engine.process("{{#if hasAuth}}auth enabled{{/if}}", {
        projectName: "my-app",
        hasAuth: false,
      });
      expect(result).toBe("");
    });

    test("excludes content when condition is undefined", () => {
      const result = engine.process("{{#if hasAuth}}auth enabled{{/if}}", {
        projectName: "my-app",
      });
      expect(result).toBe("");
    });

    test("handles multiline content", () => {
      const result = engine.process(
        "{{#if hasAuth}}\nimport auth from 'auth';\n{{/if}}",
        { projectName: "my-app", hasAuth: true }
      );
      expect(result).toBe("\nimport auth from 'auth';\n");
    });
  });

  describe("{{#unless}} conditionals", () => {
    test("includes content when condition is falsy", () => {
      const result = engine.process("{{#unless hasAuth}}no auth{{/unless}}", {
        projectName: "my-app",
        hasAuth: false,
      });
      expect(result).toBe("no auth");
    });

    test("excludes content when condition is truthy", () => {
      const result = engine.process("{{#unless hasAuth}}no auth{{/unless}}", {
        projectName: "my-app",
        hasAuth: true,
      });
      expect(result).toBe("");
    });
  });

  describe("combined usage", () => {
    test("handles variables inside conditionals", () => {
      const result = engine.process(
        "{{#if hasAuth}}Auth for {{projectName}}{{/if}}",
        { projectName: "my-app", hasAuth: true }
      );
      expect(result).toBe("Auth for my-app");
    });
  });
});
