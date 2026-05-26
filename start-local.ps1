# PowerShell helper to install and start the app on Windows
if (-not (Test-Path -Path node_modules)) {
  Write-Host "Installing dependencies..."
  npm install
}
Write-Host "Building and starting the app..."
npm run start:prod
