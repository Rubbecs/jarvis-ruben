@echo off
REM Jarvis Ruben - One-Click Start Script for Windows
REM This script installs dependencies and starts the app on localhost:4000

echo.
echo ========================================
echo   JARVIS RUBEN - Local AI Dashboard
echo ========================================
echo.
echo Starting up... this may take a minute on first run.
echo.

if not exist node_modules (
  echo [1/3] Installing dependencies...
  npm install
  if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    echo Make sure Node.js is installed: https://nodejs.org/
    pause
    exit /b 1
  )
  echo Dependencies installed!
  echo.
)

echo [2/3] Building frontend and backend...
npm run build:all
if errorlevel 1 (
  echo ERROR: Build failed
  pause
  exit /b 1
)
echo Build complete!
echo.

echo [3/3] Starting server on localhost:4000...
echo.
echo ========================================
echo   🚀 Opening http://localhost:4000
echo ========================================
echo.

timeout /t 2 /nobreak
start http://localhost:4000

npm run start --prefix packages/backend

