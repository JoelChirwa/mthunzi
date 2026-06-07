#!/bin/bash

# Mthunzi Trust - Frontend Deployment Script for cPanel
# This script should be run from the frontend directory

set -e

echo "=========================================="
echo "Mthunzi Trust - Frontend Deployment"
echo "=========================================="

# Step 1: Install dependencies if needed
echo ""
echo "Step 1: Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Dependencies already installed."
fi

# Step 2: Restore .next directory from next_safe
echo ""
echo "Step 2: Restoring .next directory..."
if [ -d "next_safe" ]; then
  node deobfuscate.js
  echo ".next directory restored successfully!"
else
  echo "ERROR: next_safe directory not found!"
  exit 1
fi

# Step 3: Verify .next exists
echo ""
echo "Step 3: Verifying build..."
if [ ! -d ".next" ]; then
  echo "ERROR: .next directory was not created!"
  exit 1
fi
echo ".next directory verified!"

# Step 4: Start the server
echo ""
echo "Step 4: Starting server..."
echo "Server will listen on all interfaces (0.0.0.0)"
NODE_ENV=production npm start

echo ""
echo "=========================================="
echo "Deployment complete!"
echo "=========================================="
