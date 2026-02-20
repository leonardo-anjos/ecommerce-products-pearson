@echo off
REM Initialize .env files from .env.example for Windows

setlocal enabledelayedexpansion

set "GREEN=[OK]"
set "YELLOW=[WARN]"

echo.
echo ================================================================
echo Initializing Environment Files (.env)
echo ================================================================
echo.

REM Backend .env
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo %GREEN% Created backend\.env from .env.example
    ) else (
        echo %YELLOW% backend\.env.example not found
    )
) else (
    echo %GREEN% backend\.env already exists
)

REM Webapp .env
if not exist "webapp\.env" (
    if exist "webapp\.env.example" (
        copy "webapp\.env.example" "webapp\.env" >nul
        echo %GREEN% Created webapp\.env from .env.example
    ) else (
        echo %YELLOW% webapp\.env.example not found
    )
) else (
    echo %GREEN% webapp\.env already exists
)

echo.
echo %GREEN% Environment files ready
echo.
echo Edit .env files if you want to customize the configuration:
echo   - backend\.env
echo   - webapp\.env
echo.
