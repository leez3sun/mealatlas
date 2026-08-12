@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 22 or newer first:
  echo https://nodejs.org/
  pause
  exit /b 1
)

if not exist "dist\index.html" (
  echo Building MealAtlas...
  call npm run build
  if errorlevel 1 (
    echo Build failed. Please keep this window and report the error.
    pause
    exit /b 1
  )
)

start "MealAtlas Local Server" cmd.exe /k node "scripts\serve.mjs"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173/"
exit /b 0
