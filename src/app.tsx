import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { WizardProvider } from "./ui/hooks/useWizard.tsx";
import { WelcomeScreen } from "./ui/screens/WelcomeScreen.tsx";
import { ProjectNameScreen } from "./ui/screens/ProjectNameScreen.tsx";
import { FrontendScreen } from "./ui/screens/FrontendScreen.tsx";
import { BackendScreen } from "./ui/screens/BackendScreen.tsx";
import { FeaturesScreen } from "./ui/screens/FeaturesScreen.tsx";
import { GeneratingScreen } from "./ui/screens/GeneratingScreen.tsx";
import { SuccessScreen } from "./ui/screens/SuccessScreen.tsx";
import { RunningHookScreen } from "./ui/screens/RunningHookScreen.tsx";
import { ErrorScreen } from "./ui/screens/ErrorScreen.tsx";
import type { CliOptions } from "./index.tsx";
import type { HookContext } from "./hooks/types.ts";

type Screen =
  | "welcome"
  | "projectName"
  | "frontend"
  | "backend"
  | "features"
  | "generating"
  | "success"
  | "runningHook"
  | "error";

export interface DeferredHook {
  hookId: string;
  ctx: HookContext;
}

interface AppProps {
  onExit: (exitCode?: number, deferredHook?: DeferredHook) => void;
  cliOptions?: CliOptions;
}

function AppContent({ onExit, cliOptions }: AppProps) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [error, setError] = useState<Error | null>(null);

  const hasHook = !!cliOptions?.hook;

  // Global Ctrl+C handler
  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") {
      onExit();
    }
  });

  const handleError = (err: Error) => {
    setError(err);
    setScreen("error");
  };

  const handleGenerationComplete = () => {
    if (hasHook) {
      setScreen("runningHook");
    } else {
      setScreen("success");
    }
  };

  const handleRunAfterExit = (hookId: string, ctx: HookContext) => {
    // Pass the deferred hook to onExit so it can run after TUI cleanup
    onExit(0, { hookId, ctx });
  };

  return (
    <box flexDirection="column">
      {screen === "welcome" && (
        <WelcomeScreen onNext={() => setScreen("projectName")} />
      )}
      {screen === "projectName" && (
        <ProjectNameScreen
          onNext={() => setScreen("frontend")}
          onBack={() => setScreen("welcome")}
        />
      )}
      {screen === "frontend" && (
        <FrontendScreen
          onNext={() => setScreen("backend")}
          onBack={() => setScreen("projectName")}
        />
      )}
      {screen === "backend" && (
        <BackendScreen
          onNext={() => setScreen("features")}
          onBack={() => setScreen("frontend")}
        />
      )}
      {screen === "features" && (
        <FeaturesScreen
          onNext={() => setScreen("generating")}
          onBack={() => setScreen("backend")}
        />
      )}
      {screen === "generating" && (
        <GeneratingScreen
          onComplete={handleGenerationComplete}
          onError={handleError}
        />
      )}
      {screen === "runningHook" && (
        <RunningHookScreen
          cliOptions={cliOptions!}
          onComplete={() => setScreen("success")}
          onError={handleError}
          onRunAfterExit={handleRunAfterExit}
        />
      )}
      {screen === "success" && <SuccessScreen onExit={onExit} hasHook={hasHook} />}
      {screen === "error" && error && <ErrorScreen error={error} onExit={onExit} />}
    </box>
  );
}

export function App({ onExit, cliOptions }: AppProps) {
  return (
    <WizardProvider>
      <AppContent onExit={onExit} cliOptions={cliOptions} />
    </WizardProvider>
  );
}
