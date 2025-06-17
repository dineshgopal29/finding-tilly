#!/bin/bash

echo "Starting Finding Tilly React App with clean environment..."

# Kill any running React processes
echo "Stopping any running React processes..."
pkill -f "node.*react-scripts start" || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Clean up node_modules and cache
echo "Cleaning up node_modules and cache..."
rm -rf node_modules/.cache
npm cache clean --force

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the app
echo "Starting the app..."
npm start
