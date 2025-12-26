// Auto-generated embedded templates for compiled binary support
// This file contains all template files as strings

export interface EmbeddedFile {
  path: string;
  content: string;
}

export interface EmbeddedTemplates {
  [framework: string]: EmbeddedFile[];
}

export const embeddedTemplates: EmbeddedTemplates = {
  "frontend/react": [
    {
      path: "index.html",
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{projectName}}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    },
    {
      path: "vite.config.ts",
      content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
`,
    },
    {
      path: "tsconfig.json",
      content: `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`,
    },
    {
      path: "tsconfig.app.json",
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src"]
}
`,
    },
    {
      path: "tsconfig.node.json",
      content: `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
`,
    },
    {
      path: ".gitignore",
      content: `# Dependencies
node_modules/

# Build output
dist/

# Logs
*.log
npm-debug.log*

# Editor directories
.idea/
.vscode/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Environment files
.env
.env.local
.env.*.local
`,
    },
    {
      path: "src/main.tsx",
      content: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import "./app.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
`,
    },
    {
      path: "src/App.tsx",
      content: `import { useQuery } from "@tanstack/react-query";

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
`,
    },
    {
      path: "src/app.css",
      content: `@import "tailwindcss";

@theme {
  --color-primary: oklch(0.6 0.2 250);
  --color-secondary: oklch(0.7 0.15 200);
}
`,
    },
    {
      path: "src/lib/query-client.ts",
      content: `import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});
`,
    },
  ],
  "backend/elysia": [
    {
      path: "src/index.ts",
      content: `import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { healthRoutes } from "./routes/health";

const app = new Elysia()
  .use(cors())
  .use(healthRoutes)
  .listen(3001);

console.log(
  \`{{projectName}} backend running at \${app.server?.hostname}:\${app.server?.port}\`
);

export type App = typeof app;
`,
    },
    {
      path: "src/routes/health.ts",
      content: `import { Elysia } from "elysia";

export const healthRoutes = new Elysia({ prefix: "/api" }).get(
  "/health",
  () => ({
    status: "healthy",
    timestamp: new Date().toISOString(),
  })
);
`,
    },
    {
      path: "tsconfig.json",
      content: `{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "ESNext",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noPropertyAccessFromIndexSignature": false
  }
}
`,
    },
    {
      path: ".gitignore",
      content: `# Dependencies
node_modules/

# Build output
dist/

# Logs
*.log
npm-debug.log*

# Editor directories
.idea/
.vscode/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Environment files
.env
.env.local
.env.*.local

# Database
*.db
*.sqlite
`,
    },
  ],
};
