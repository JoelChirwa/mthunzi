@echo off
REM Quick deployment script for Mthunzi Trust Frontend (Windows)
REM Usage: quick-deploy.bat
REM This script builds locally and creates a zip for easy cPanel upload

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo   Mthunzi Trust - Frontend Deployment
echo ==========================================
echo.

cd frontend

REM Step 1: Install dependencies
echo [1/4] Installing dependencies...
call npm install

REM Step 2: Build
echo.
echo [2/4] Building Next.js...
call npm run build

REM Step 3: Create deployment folder
echo.
echo [3/4] Creating deployment package...

if exist "deploy-package" (
  rmdir /s /q deploy-package
)

mkdir deploy-package

REM Copy only necessary files
xcopy .next deploy-package\.next\ /E /I /Q
xcopy public deploy-package\public\ /E /I /Q
xcopy node_modules deploy-package\node_modules\ /E /I /Q
copy package.json deploy-package\
copy package-lock.json deploy-package\
copy server.js deploy-package\
copy server.cjs deploy-package\
copy .env.production deploy-package\
copy next.config.ts deploy-package\
copy tsconfig.json deploy-package\ >nul 2>&1

REM Create ZIP using PowerShell
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set ZIP_NAME=mthunzi-frontend-!mydate!_!mytime!.zip

echo Compressing files...
powershell -Command "Compress-Archive -Path .\deploy-package\* -DestinationPath .\!ZIP_NAME! -Force" >nul

echo.
echo ✓ Package created: !ZIP_NAME!
echo.

REM Step 4: Instructions
echo [4/4] Next steps:
echo.
echo 1. Go to cPanel File Manager
echo 2. Navigate to public_html/frontend
echo 3. Click Upload button
echo 4. Select and upload: !ZIP_NAME!
echo 5. Right-click the ZIP ^-^> Extract
echo 6. Delete the ZIP file
echo 7. In cPanel Node.js Selector ^-^> Restart Application
echo.
echo Done! Your site will update in ~30 seconds
echo.
echo ==========================================
echo.

REM Cleanup
rmdir /s /q deploy-package

pause
