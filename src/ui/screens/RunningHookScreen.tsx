import { useEffect, useState } from "react";
import { join } from "path";
import { Header } from "../components/Header.tsx";
import { useWizard } from "../hooks/useWizard.tsx";
import { hookRegistry, type HookContext } from "../../hooks/index.ts";
import type { CliOptions } from "../../index.tsx";

interface RunningHookScreenProps {
  cliOptions: CliOptions;
  onComplete: () => void;
  onError: (error: Error) => void;
  onRunAfterExit: (hookId: string, ctx: HookContext) => void;
}

export function RunningHookScreen({ 
  cliOptions, 
  onComplete, 
  onError,
  onRunAfterExit,
}: RunningHookScreenProps) {
  const { getFullConfig } = useWizard();
  const [status, setStatus] = useState("Preparing...");

  useEffect(() => {
    const runHook = async () => {
      const config = getFullConfig();
      const projectPath = join(process.cwd(), config.projectName);
      
      const ctx: HookContext = {
        projectName: config.projectName,
        projectPath,
        frontendPath: join(projectPath, "frontend"),
        backendPath: join(projectPath, "backend"),
      };

      try {
        if (cliOptions.hook) {
          const hook = hookRegistry.get(cliOptions.hook);
          if (!hook) {
            onError(new Error(`Hook not found: ${cliOptions.hook}`));
            return;
          }
          
          // If hook takes over terminal, defer execution until after TUI exits
          if (hook.takesOverTerminal) {
            setStatus(`Hook "${hook.name}" will run after exit...`);
            onRunAfterExit(cliOptions.hook, ctx);
            return;
          }

          setStatus(`Running hook: ${hook.name}...`);
          const result = await hookRegistry.execute(cliOptions.hook, ctx);
          if (!result.success) {
            onError(new Error(result.error || "Hook failed"));
            return;
          }
        } else if (cliOptions.postScript) {
          setStatus("Running post-generation script...");
          const result = await hookRegistry.executeCustomScript(cliOptions.postScript, ctx);
          if (!result.success) {
            onError(new Error(result.error || "Script failed"));
            return;
          }
        }

        onComplete();
      } catch (error) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    };

    runHook();
  }, []);

  return (
    <box flexDirection="column" padding={1}>
      <Header title="Running Hook" />

      <box marginTop={1} marginBottom={1}>
        <text fg="#00ffff">{status}</text>
      </box>

      <box marginTop={1}>
        <text fg="#808080">Please wait...</text>
      </box>
    </box>
  );
}
