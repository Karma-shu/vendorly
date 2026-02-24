Write-Host "Starting Vendorly Application..." -ForegroundColor Green
Write-Host ""

# Check if npm is available
try {
    Get-Command npm -ErrorAction Stop | Out-Null
} catch {
    Write-Host "ERROR: npm is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Set location to project directory
Set-Location -Path $PSScriptRoot

# Install dependencies if node_modules doesn't exist
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Build the project
Write-Host "Building the project..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Build failed, using existing dist folder if available" -ForegroundColor Yellow
}

# Start the preview server
Write-Host "Starting preview server on http://localhost:4173" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
npm run preview