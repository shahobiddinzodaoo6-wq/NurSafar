# NurSafar Development Startup Script
# Run this every time you start development: .\start-dev.ps1

$backendDir = "D:\Nursafar-project\Nursafar-backend"
$nodePath = "C:\Program Files\nodejs\node.exe"
$prismaBin = "$backendDir\node_modules\prisma\build\index.js"

Write-Host "Starting Prisma local Postgres..." -ForegroundColor Cyan
Start-Process -FilePath $nodePath -ArgumentList $prismaBin, "dev" -WorkingDirectory $backendDir -WindowStyle Minimized

Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
$ready = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Seconds 1
    $listening = netstat -ano 2>$null | Select-String ":51214"
    if ($listening) { $ready = $true; break }
}

if (-not $ready) {
    Write-Host "ERROR: Prisma Postgres did not start in time." -ForegroundColor Red
    exit 1
}
Write-Host "Database ready on port 51214." -ForegroundColor Green

Write-Host "Starting NestJS backend..." -ForegroundColor Cyan
Start-Process -FilePath $nodePath -ArgumentList "dist/src/main.js" -WorkingDirectory $backendDir -WindowStyle Minimized

Start-Sleep -Seconds 4
$backendUp = netstat -ano 2>$null | Select-String ":3001"
if ($backendUp) {
    Write-Host "Backend running on http://localhost:3001" -ForegroundColor Green
    Write-Host ""
    Write-Host "Development environment is ready!" -ForegroundColor Green
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  Backend:  http://localhost:3001/api" -ForegroundColor White
    Write-Host "  Swagger:  http://localhost:3001/api/docs" -ForegroundColor White
    Write-Host ""
    Write-Host "Test accounts:" -ForegroundColor Yellow
    Write-Host "  Admin:   admin@nursafar.tj / AdminSuperSecret!" -ForegroundColor White
    Write-Host "  Partner: agency@nursafar.tj / AgencyTest123!" -ForegroundColor White
    Write-Host "  Driver:  driver@nursafar.tj / DriverTest123!" -ForegroundColor White
} else {
    Write-Host "ERROR: Backend did not start. Check for errors." -ForegroundColor Red
}
