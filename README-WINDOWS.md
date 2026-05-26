Jarvis Ruben — Windows Local Run

Prerequisites
- Install Node.js (recommended >= 18) from https://nodejs.org/

Quickstart (PowerShell)
1. Open Windows Terminal (PowerShell) and run:

```powershell
git clone <repo-url>
cd jarvis-ruben
npm install
npm run start:prod
```

Quickstart (Command Prompt)
```cmd
git clone <repo-url>
cd jarvis-ruben
npm install
npm run start:prod
```

What this does
- `npm install` installs dependencies for the workspace.
- `npm run start:prod` builds the frontend and backend then starts the compiled backend server.

Access
- Open http://localhost:4000 in your browser.

Change port (PowerShell)
```powershell
$env:PORT=5000
npm run start:prod
```

Packaging for Windows (optional)
- You can create a single executable using `pkg` or `nexe`. Install and build on a machine with Node.js and follow their docs.

If you want, I can add an automated `pkg` packaging script next.
