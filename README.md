# jarvis-ruben

A local-first autonomous agent dashboard scaffold for Jarvis-style workflows.

## Architecture

- `packages/backend` - Express + local JSON file persistence API server
- `packages/frontend` - Vite + React dashboard
- `packages/backend/data` - local storage for agent data and encryption secret

## Features included

- Agent management API and dashboard panel
- Task orchestration endpoints and task dashboard panel
- Local API key storage and encryption utilities
- Memory vault API and explorer panel
- Local-first architecture with no mandatory cloud dependency

## Getting Started

1. Install dependencies from the workspace root:

```bash
npm run bootstrap
```

2. Start the backend server from the workspace root:

```bash
npm run start
```

3. Start the frontend development server from the workspace root:

```bash
npm run dev
```

The frontend proxies API requests to `http://localhost:4000/api`.
