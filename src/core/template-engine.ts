import { mkdir, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { embeddedTemplates, type EmbeddedFile } from "./embedded-templates.ts";

export interface TemplateContext {
  projectName: string;
  [key: string]: unknown;
}

export class TemplateEngine {
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
   * Process all embedded templates for a framework and output to destination
   */
  async processDirectory(
    templateDir: string,
    outputDir: string,
    context: TemplateContext
  ): Promise<void> {
    const files: EmbeddedFile[] | undefined = embeddedTemplates[templateDir];
    
    if (!files) {
      throw new Error(`No embedded templates found for: ${templateDir}`);
    }

    for (const file of files) {
      // Process filename (may contain template variables)
      let processedPath = this.process(file.path, context);
      // Remove .template extension if present
      processedPath = processedPath.replace(/\.template$/, "");

      const destFile = join(outputDir, processedPath);

      // Process content and write
      const processedContent = this.process(file.content, context);

      await mkdir(dirname(destFile), { recursive: true });
      await writeFile(destFile, processedContent);
    }
  }
}
