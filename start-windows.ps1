Write-Host "Starting Atif Hasan Portfolio..." -ForegroundColor Green
Write-Host ""
Write-Host "Installing dependencies (if needed)..." -ForegroundColor Yellow
npm install
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
$env:NODE_ENV="development"
npx tsx server/index.ts
Read-Host "Press Enter to exit"