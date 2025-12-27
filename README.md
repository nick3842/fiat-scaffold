# fiat

Full-stack TypeScript project generator. Creates React + Elysia apps on Bun.

## Install

```bash
bun add -g @nrs/fiat
```

## Usage

```bash
fiat                        # Interactive wizard
fiat --hook tmux-dev        # Generate and open in tmux session
fiat --hook ./setup.sh      # Run custom script after generation
fiat --list-hooks           # List available hooks
```

## What it generates

```
my-app/
├── frontend/    # React 19 + Vite + Tailwind CSS v4 + TanStack Query
├── backend/     # Elysia on Bun
└── README.md
```

Dependencies are installed automatically. Git repo initialized with initial commit.

## Hooks

Scripts receive these environment variables:
- `SCAFFOLD_PROJECT_NAME`
- `SCAFFOLD_PROJECT_PATH`
- `SCAFFOLD_FRONTEND_PATH`
- `SCAFFOLD_BACKEND_PATH`
