import type { Hook, HookContext, HookResult } from "./types.ts";

class HookRegistry {
  private hooks: Map<string, Hook> = new Map();

  register(hook: Hook): void {
    this.hooks.set(hook.id, hook);
  }

  get(id: string): Hook | undefined {
    return this.hooks.get(id);
  }

  getAll(): Hook[] {
    return Array.from(this.hooks.values());
  }

  async execute(hookId: string, ctx: HookContext): Promise<HookResult> {
    const hook = this.hooks.get(hookId);
    if (!hook) {
      return { success: false, error: `Hook not found: ${hookId}` };
    }

    const script = typeof hook.script === "function" 
      ? hook.script(ctx) 
      : hook.script;

    try {
      const proc = Bun.spawn(["bash", "-c", script], {
        cwd: ctx.projectPath,
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
        env: {
          ...process.env,
          SCAFFOLD_PROJECT_NAME: ctx.projectName,
          SCAFFOLD_PROJECT_PATH: ctx.projectPath,
          SCAFFOLD_FRONTEND_PATH: ctx.frontendPath,
          SCAFFOLD_BACKEND_PATH: ctx.backendPath,
        },
      });

      await proc.exited;

      // Restore cursor visibility after hook (in case hook hid it)
      process.stdout.write("\x1b[?25h");

      if (proc.exitCode !== 0) {
        return { success: false, error: `Hook exited with code ${proc.exitCode}` };
      }

      return { success: true };
    } catch (error) {
      // Restore cursor even on error
      process.stdout.write("\x1b[?25h");
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  async executeScriptFile(filePath: string, ctx: HookContext): Promise<HookResult> {
    const { resolve } = await import("path");
    const absolutePath = resolve(process.cwd(), filePath);
    
    // Check if file exists
    const file = Bun.file(absolutePath);
    if (!(await file.exists())) {
      return { success: false, error: `Script file not found: ${absolutePath}` };
    }

    try {
      const proc = Bun.spawn(["bash", absolutePath], {
        cwd: ctx.projectPath,
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
        env: {
          ...process.env,
          SCAFFOLD_PROJECT_NAME: ctx.projectName,
          SCAFFOLD_PROJECT_PATH: ctx.projectPath,
          SCAFFOLD_FRONTEND_PATH: ctx.frontendPath,
          SCAFFOLD_BACKEND_PATH: ctx.backendPath,
        },
      });

      await proc.exited;

      // Restore cursor visibility after script (in case script hid it)
      process.stdout.write("\x1b[?25h");

      if (proc.exitCode !== 0) {
        return { success: false, error: `Script exited with code ${proc.exitCode}` };
      }

      return { success: true };
    } catch (error) {
      // Restore cursor even on error
      process.stdout.write("\x1b[?25h");
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
}

export const hookRegistry = new HookRegistry();
