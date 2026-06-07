#!/usr/bin/env bash

# Quick deployment script for Mthunzi Trust Frontend
# Usage: ./deploy.sh
# This script builds locally and creates a zip for easy cPanel upload

set -e

echo ""
echo "=========================================="
echo "  Mthunzi Trust - Frontend Deployment"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd frontend

# Step 1: Install dependencies
echo -e "${YELLOW}[1/4]${NC} Installing dependencies..."
npm install

# Step 2: Build
echo ""
echo -e "${YELLOW}[2/4]${NC} Building Next.js..."
npm run build

# Step 3: Create deployment ZIP
echo ""
echo -e "${YELLOW}[3/4]${NC} Creating deployment package..."

if [ -d "deploy-package" ]; then
  rm -rf deploy-package
fi

mkdir deploy-package

# Copy only necessary files
cp -r .next deploy-package/
cp -r public deploy-package/
cp -r node_modules deploy-package/
cp package.json deploy-package/
cp package-lock.json deploy-package/
cp server.js deploy-package/
cp server.cjs deploy-package/
cp .env.production deploy-package/
cp next.config.ts deploy-package/
cp tsconfig.json deploy-package/ 2>/dev/null || true

# Create ZIP
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ZIP_NAME="mthunzi-frontend-${TIMESTAMP}.zip"
cd deploy-package
zip -r "../${ZIP_NAME}" . -q
cd ..

echo -e "${GREEN}✓${NC} Package created: ${ZIP_NAME}"
echo ""

# Step 4: Instructions
echo -e "${YELLOW}[4/4]${NC} Next steps:"
echo ""
echo -e "${GREEN}1.${NC} Go to cPanel File Manager"
echo -e "${GREEN}2.${NC} Navigate to public_html/frontend"
echo -e "${GREEN}3.${NC} Click Upload button"
echo -e "${GREEN}4.${NC} Select and upload: ${ZIP_NAME}"
echo -e "${GREEN}5.${NC} Right-click the ZIP → Extract"
echo -e "${GREEN}6.${NC} Delete the ZIP file"
echo -e "${GREEN}7.${NC} In cPanel Node.js Selector → Restart Application"
echo ""
echo -e "${GREEN}Done!${NC} Your site will update in ~30 seconds"
echo ""
echo "=========================================="
echo ""

# Cleanup
rm -rf deploy-package
