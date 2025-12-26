export interface ScaffoldConfig {
  projectName: string;
  outputPath: string;
  frontend: FrontendConfig;
  backend: BackendConfig;
  features: FeatureConfig[];
}

export interface FrontendConfig {
  framework: "react" | "solid";
  styling: "tailwind";
  dataFetching: "tanstack-query";
}

export interface BackendConfig {
  framework: "elysia";
  database?: "none" | "sqlite" | "postgres";
}

export interface FeatureConfig {
  name: string;
  enabled: boolean;
  options?: Record<string, unknown>;
}

export const defaultConfig: Partial<ScaffoldConfig> = {
  frontend: {
    framework: "react",
    styling: "tailwind",
    dataFetching: "tanstack-query",
  },
  backend: {
    framework: "elysia",
    database: "none",
  },
  features: [],
};
