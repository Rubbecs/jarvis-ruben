Jarvis Ruben — Windows Local Run
================================

Prerequisites
-------------
- Install Node.js (recommended >= 18) from https://nodejs.org/

Quickstart (PowerShell)
-----------------------
1. Open Windows Terminal (PowerShell) and run:

```powershell
git clone https://github.com/Rubbecs/jarvis-ruben.git
cd jarvis-ruben
npm run bootstrap
npm run start:prod
```

Quickstart (Command Prompt)
---------------------------
```cmd
git clone https://github.com/Rubbecs/jarvis-ruben.git
cd jarvis-ruben
npm run bootstrap
npm run start:prod
```

Or simply double-click **`start-local.bat`** after extracting the repo.

What this does
--------------
- `npm run bootstrap` installs dependencies for all packages.
- `npm run start:prod` builds the frontend and backend, then starts the compiled backend server on port 4000.

Access the app
--------------
- Open http://localhost:4000 in your browser.

Change port (PowerShell)
------------------------
```powershell
$env:PORT=5000
npm run start:prod
```

Change port (Command Prompt)
----------------------------
```cmd
set PORT=5000
npm run start:prod
```

Troubleshooting
---------------
**"No workspaces found" error**
- Run `npm run bootstrap` from the root folder to ensure all dependencies are installed correctly.

**Port already in use**
- Change the `PORT` environment variable (see above) or kill the process using the port:
  - PowerShell: `Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process`
  - Command Prompt: `netstat -ano | findstr :4000` then `taskkill /PID <PID> /F`

Available commands
------------------
- `npm run bootstrap` — Install all dependencies
- `npm run dev` — Start frontend dev server (http://localhost:5173)
- `npm run start` — Start backend server directly
- `npm run build` — Build frontend
- `npm run build:all` — Build frontend and backend
- `npm run start:prod` — Full build and start (recommended for local use)

