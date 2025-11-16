#!/bin/bash

echo "Starting Velvet Routes Frontend Development Server..."
echo

# Change to the project directory
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
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

# Start the frontend development server
echo "Starting Velvet Routes Frontend Server..."
echo
echo "Frontend will be available at: http://localhost:5173"
echo
echo "Press Ctrl+C to stop the server"
echo

npm run dev
