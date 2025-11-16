#!/bin/bash

echo "Starting Velvet Routes Server..."
echo

# Change to the project directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if MySQL is running
echo "Checking MySQL connection..."
if ! command -v mysql &> /dev/null; then
    echo "Warning: MySQL command line tools not found"
    echo "Please ensure MySQL server is running"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies"
        exit 1
    fi
fi

# Set environment variables
export NODE_ENV=development
export PORT=3000
export MYSQL_HOST=localhost
export MYSQL_USER=root
export MYSQL_PASSWORD=""
export MYSQL_DATABASE=velvet_routes
export JWT_SECRET=velvet_routes_super_secret_key_2025

# Start the server
echo "Starting Velvet Routes API Server on port 3000..."
echo
echo "Server will be available at: http://localhost:3000"
echo "API endpoints: http://localhost:3000/api"
echo
echo "Press Ctrl+C to stop the server"
echo

npm run server
