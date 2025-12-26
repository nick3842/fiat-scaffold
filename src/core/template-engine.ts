import { readdir, mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";

export interface TemplateContext {
  projectName: string;
  [key: string]: unknown;
}

export class TemplateEngine {
  private templatesRoot: string;

  constructor(templatesRoot: string) {
    this.templatesRoot = templatesRoot;
  }

  /**
   * Process a template string with context variables
   * Supports: {{variable}}, {{#if condition}}...{{/if}}, {{#unless condition}}...{{/unless}}
   */
  process(template: string, context: TemplateContext): string {
    let result = template;

    // Conditional blocks: {{#if condition}}...{{/if}}
    result = result.replace(
      /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_match, condition, content) => {
        return context[condition] ? content : "";
      }
    );

    // Negated conditionals: {{#unless condition}}...{{/unless}}
    result = result.replace(
      /\{\{#unless (\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/g,
      (_match, condition, content) => {
        return !context[condition] ? content : "";
      }
    );

    // Simple variable interpolation: {{variableName}}
    result = result.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
      const value = context[key];
      return value !== undefined ? String(value) : "";
    });

    return result;
  }

  /**
   * Process all templates in a directory and output to destination
   */
  async processDirectory(
    templateDir: string,
    outputDir: string,
    context: TemplateContext
  ): Promise<void> {
    const sourcePath = join(this.templatesRoot, templateDir);

    const processDir = async (currentPath: string, relativePath: string = "") => {
      const entries = await readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const entryRelativePath = relativePath ? join(relativePath, entry.name) : entry.name;

        if (entry.isDirectory()) {
          await processDir(join(currentPath, entry.name), entryRelativePath);
        } else if (entry.isFile()) {
          // Process filename (may contain template variables)
          let processedPath = this.process(entryRelativePath, context);
          // Remove .template extension if present
          processedPath = processedPath.replace(/\.template$/, "");

          const sourceFile = join(currentPath, entry.name);
          const destFile = join(outputDir, processedPath);

          // Read, process, and write
          const content = await Bun.file(sourceFile).text();
          const processedContent = this.process(content, context);

          await mkdir(dirname(destFile), { recursive: true });
          await writeFile(destFile, processedContent);
        }
      }
    };

    await processDir(sourcePath);
  }
}
