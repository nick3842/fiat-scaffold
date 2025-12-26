import type { FrameworkAdapter } from "./types.ts";

class FrameworkRegistry {
  private frontendFrameworks = new Map<string, FrameworkAdapter>();
  private backendFrameworks = new Map<string, FrameworkAdapter>();

  registerFrontend(adapter: FrameworkAdapter): void {
    this.frontendFrameworks.set(adapter.id, adapter);
  }

  registerBackend(adapter: FrameworkAdapter): void {
    this.backendFrameworks.set(adapter.id, adapter);
  }

  getFrontendOptions(): FrameworkAdapter[] {
    return Array.from(this.frontendFrameworks.values());
  }

  getBackendOptions(): FrameworkAdapter[] {
    return Array.from(this.backendFrameworks.values());
  }

  getFrontend(id: string): FrameworkAdapter | undefined {
    return this.frontendFrameworks.get(id);
  }

  getBackend(id: string): FrameworkAdapter | undefined {
    return this.backendFrameworks.get(id);
  }
}

export const frameworkRegistry = new FrameworkRegistry();
