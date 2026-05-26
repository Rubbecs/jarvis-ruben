# jarvis-ruben

A local-first autonomous agent dashboard built to feel like a next-gen Jarvis control center.

**Run your own AI cockpit locally, manage agents, schedule tasks, and explore memory—all without cloud lock-in.**

## Why it rules

- **Local-first by design**: all data stays on your machine.
- **Zero native binary drama**: uses JSON persistence instead of native SQLite bindings.
- **Fast dev workflow**: one repo, two powerful packages, instant startup.
- **Agent-first UX**: agent cloning, import/export, memory, and workflow hooks are all ready.
- **Built for experimentation**: task orchestration, retry/pause, voice stubs, and automation infrastructure.

## What’s inside

- Agent management with personality, tools, model settings, and team metadata
- Task dashboard with scheduling, retries, pause/resume, and agent-specific task views
- Memory vault for local context storage and knowledge exploration
- API key manager with local encryption support
- Workflow templates and multi-agent orchestration foundations
- Frontend proxy setup for smooth API development
## Tool integrations

This project includes a tool registry for agent integrations, so you can wire agents into external apps and services.

Available starter tools include:

- `discord` — Discord Chat
- `gmail` — Gmail Assistant
- `slack` — Slack Hub
- `calendar` — Calendar Scheduler
- `github` — GitHub Companion
- `drive` — Drive & Files
- `browser` — Browser Automator
- `screen-share` — Screen Assistant
- `file-editor` — File Editor
- `terminal` — Terminal Shell
- `notifications` — Notifications
- `notes` — Notes & Memory

Agents can be configured with any comma-separated tool list, and the backend exposes the tool registry at `GET /api/tools`.
## Quick start

From the workspace root:

```bash
npm run bootstrap
npm run start
npm run dev
```

Then open the UI in your browser.

Windows users: see [README-WINDOWS.md](README-WINDOWS.md) for a one-command local start flow.

## Local ports

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`

## Architecture

- `packages/backend` – Express API server with local JSON data persistence
- `packages/frontend` – Vite + React dashboard UI
- `packages/backend/data` – local store for app data and encryption secrets

## Built for

- rapid autonomous agent prototyping
- local automation experiments
- clean, offline-first AI workflows
- hands-on Jarvis-style dashboard building
