import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  ScaffoldConfig,
  FrontendConfig,
  BackendConfig,
  FeatureConfig,
} from "../../core/config.ts";
import { defaultConfig } from "../../core/config.ts";
import { join } from "path";

interface WizardState {
  config: Partial<ScaffoldConfig>;
  setProjectName: (name: string) => void;
  setFrontend: (frontend: FrontendConfig) => void;
  setBackend: (backend: BackendConfig) => void;
  setFeatures: (features: FeatureConfig[]) => void;
  toggleFeature: (featureId: string) => void;
  getFullConfig: () => ScaffoldConfig;
}

const WizardContext = createContext<WizardState | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Partial<ScaffoldConfig>>({
    ...defaultConfig,
    features: [],
  });

  const value: WizardState = {
    config,

    setProjectName: (name) =>
      setConfig((prev) => ({
        ...prev,
        projectName: name,
        outputPath: join(process.cwd(), name),
      })),

    setFrontend: (frontend) => setConfig((prev) => ({ ...prev, frontend })),

    setBackend: (backend) => setConfig((prev) => ({ ...prev, backend })),

    setFeatures: (features) => setConfig((prev) => ({ ...prev, features })),

    toggleFeature: (featureId) =>
      setConfig((prev) => {
        const features = prev.features || [];
        const existing = features.find((f) => f.name === featureId);

        if (existing) {
          return {
            ...prev,
            features: features.map((f) =>
              f.name === featureId ? { ...f, enabled: !f.enabled } : f
            ),
          };
        } else {
          return {
            ...prev,
            features: [...features, { name: featureId, enabled: true }],
          };
        }
      }),

    getFullConfig: () => {
      if (!config.projectName) {
        throw new Error("Project name is required");
      }
      return {
        projectName: config.projectName,
        outputPath: config.outputPath || join(process.cwd(), config.projectName),
        frontend: config.frontend || defaultConfig.frontend!,
        backend: config.backend || defaultConfig.backend!,
        features: config.features || [],
      };
    },
  };

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

export function useWizard(): WizardState {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within WizardProvider");
  }
  return context;
}
