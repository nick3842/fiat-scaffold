import type { Hook } from "../types.ts";

export const tmuxDevHook: Hook = {
  id: "tmux-dev",
  name: "Tmux Development Session",
  description: "Opens project in a new tmux session with frontend and backend windows, each with dev server and shell panes",
  takesOverTerminal: true,
  script: (ctx) => `
#!/bin/bash
set -e

SESSION_NAME="${ctx.projectName}"
FRONTEND_PATH="${ctx.frontendPath}"
BACKEND_PATH="${ctx.backendPath}"

# Kill existing session with this name if it exists
tmux kill-session -t "$SESSION_NAME" 2>/dev/null || true

# Create new session with frontend window
tmux new-session -d -s "$SESSION_NAME" -n "frontend" -c "$FRONTEND_PATH"

# Split frontend window vertically (left: dev server, right: shell)
tmux split-window -h -t "$SESSION_NAME:frontend" -c "$FRONTEND_PATH"

# Run bun dev in left pane
tmux send-keys -t "$SESSION_NAME:frontend.0" "bun dev" C-m

# Right pane is just a shell (already in frontend dir)

# Create backend window
tmux new-window -t "$SESSION_NAME" -n "backend" -c "$BACKEND_PATH"

# Split backend window vertically (left: dev server, right: shell)
tmux split-window -h -t "$SESSION_NAME:backend" -c "$BACKEND_PATH"

# Run bun dev in left pane
tmux send-keys -t "$SESSION_NAME:backend.0" "bun dev" C-m

# Right pane is just a shell (already in backend dir)

# Select frontend window and left pane
tmux select-window -t "$SESSION_NAME:frontend"
tmux select-pane -t "$SESSION_NAME:frontend.0"

# If already inside tmux, switch to the new session; otherwise attach
if [ -n "$TMUX" ]; then
  tmux switch-client -t "$SESSION_NAME"
else
  exec tmux attach-session -t "$SESSION_NAME"
fi
`,
};
