import type { FeatureModule } from "./types.ts";

class FeatureRegistry {
  private features = new Map<string, FeatureModule>();

  register(feature: FeatureModule): void {
    this.features.set(feature.id, feature);
  }

  get(id: string): FeatureModule | undefined {
    return this.features.get(id);
  }

  getAll(): FeatureModule[] {
    return Array.from(this.features.values());
  }
}

export const featureRegistry = new FeatureRegistry();
