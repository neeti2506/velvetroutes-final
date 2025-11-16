@echo off
echo Starting Complete Velvet Routes Application...
echo.

REM Change to the project directory
cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Set environment variables
set NODE_ENV=development
set PORT=3000
set MYSQL_HOST=localhost
set MYSQL_USER=root
set MYSQL_PASSWORD=
set MYSQL_DATABASE=velvet_routes
set JWT_SECRET=velvet_routes_super_secret_key_2025

echo Starting both Backend and Frontend servers...
echo.
echo Backend API: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend server in background
start "Velvet Routes Backend" cmd /k "npm run server"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
start "Velvet Routes Frontend" cmd /k "npm run dev"

echo Both servers are starting...
echo Check the opened windows for server status.
echo.
pause
