@echo off
echo Starting Velvet Routes Server...
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

REM Check if MySQL is running
echo Checking MySQL connection...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo Warning: MySQL command line tools not found
    echo Please ensure MySQL server is running
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

REM Start the server
echo Starting Velvet Routes API Server on port 3000...
echo.
echo Server will be available at: http://localhost:3000
echo API endpoints: http://localhost:3000/api
echo.
echo Press Ctrl+C to stop the server
echo.

npm run server

pause
