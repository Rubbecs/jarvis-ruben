@echo off
REM Simple helper to install and start the app on Windows (Command Prompt)
if not exist node_modules (
  echo Installing dependencies...
  npm install || exit /b 1
)
echo Building and starting the app...
npm run start:prod
pause
