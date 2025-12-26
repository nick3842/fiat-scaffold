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
import { ErrorScreen } from "./ui/screens/ErrorScreen.tsx";

type Screen =
  | "welcome"
  | "projectName"
  | "frontend"
  | "backend"
  | "features"
  | "generating"
  | "success"
  | "error";

interface AppProps {
  onExit: () => void;
}

function AppContent({ onExit }: AppProps) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [error, setError] = useState<Error | null>(null);

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
          onComplete={() => setScreen("success")}
          onError={handleError}
        />
      )}
      {screen === "success" && <SuccessScreen onExit={onExit} />}
      {screen === "error" && error && <ErrorScreen error={error} onExit={onExit} />}
    </box>
  );
}

export function App({ onExit }: AppProps) {
  return (
    <WizardProvider>
      <AppContent onExit={onExit} />
    </WizardProvider>
  );
}
