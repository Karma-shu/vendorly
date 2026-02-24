@echo off
echo Starting Vendorly Application...
echo.

REM Check if npm is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to the project directory
cd /d "%~dp0"

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Build the project
echo Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo WARNING: Build failed, using existing dist folder if available
)

REM Start the preview server
echo Starting preview server on http://localhost:4173
echo Press Ctrl+C to stop the server
call npm run preview

pause