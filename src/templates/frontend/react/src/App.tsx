import { useQuery } from "@tanstack/react-query";

interface HealthResponse {
  status: string;
  timestamp: string;
}

function App() {
  const { data, isLoading, error } = useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await fetch("/api/health");
      if (!response.ok) {
        throw new Error("Failed to fetch health status");
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">{{projectName}}</h1>
        <p className="text-slate-400 mb-6">Full-stack TypeScript application</p>

        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h2 className="text-sm font-medium text-slate-400 mb-2">Backend Status</h2>
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-yellow-500">Connecting...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-red-500">Disconnected</span>
              </div>
            )}
            {data && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-green-500">{data.status}</span>
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <h2 className="text-sm font-medium text-slate-400 mb-2">Tech Stack</h2>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>React 19 + Vite</li>
              <li>Tailwind CSS v4</li>
              <li>TanStack Query v5</li>
              <li>Elysia on Bun</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-6 text-center">
          Edit <code className="text-cyan-400">src/App.tsx</code> to get started
        </p>
      </div>
    </div>
  );
}

export default App;
