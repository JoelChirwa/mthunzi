@echo off
REM Mthunzi Trust - Frontend Deployment Script for Windows cPanel
REM This script should be run from the frontend directory

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Mthunzi Trust - Frontend Deployment
echo ==========================================
echo.

REM Step 1: Install dependencies if needed
echo Step 1: Checking dependencies...
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
) else (
  echo Dependencies already installed.
)

REM Step 2: Restore .next directory from next_safe
echo.
echo Step 2: Restoring .next directory...
if exist "next_safe" (
  call node deobfuscate.js
  echo .next directory restored successfully!
) else (
  echo ERROR: next_safe directory not found!
  exit /b 1
)

REM Step 3: Verify .next exists
echo.
echo Step 3: Verifying build...
if not exist ".next" (
  echo ERROR: .next directory was not created!
  exit /b 1
)
echo .next directory verified!

REM Step 4: Start the server
echo.
echo Step 4: Starting server...
echo Server will listen on all interfaces (0.0.0.0)
set NODE_ENV=production
call npm start

echo.
echo ==========================================
echo Deployment complete!
echo ==========================================
echo.
pause
