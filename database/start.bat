@echo off
setlocal enabledelayedexpansion

if not exist .env (
    echo Enter the MySQL root password:
    set /p MYSQL_ROOT_PASSWORD=
    echo Enter the MySQL user username:
    set /p MYSQL_USER=
    echo Enter the MySQL user password:
    set /p MYSQL_PASSWORD=
    set MYSQL_DATABASE=users_db
    (
        echo MYSQL_ROOT_PASSWORD=!MYSQL_ROOT_PASSWORD!
        echo MYSQL_DATABASE=!MYSQL_DATABASE!
        echo MYSQL_USER=!MYSQL_USER!
        echo MYSQL_PASSWORD=!MYSQL_PASSWORD!
    ) > .env
    echo .env file created successfully.
) else (
    echo .env file already exists. Skipping creation.
)

set dockerPath="C:\Program Files\Docker\Docker\Docker Desktop.exe"

tasklist /FI "IMAGENAME eq Docker Desktop.exe" /NH | find "Docker Desktop.exe" >nul
if %errorlevel% neq 0 (
    echo Starting Docker Desktop...
    start "" %dockerPath%
) else (
    echo Docker Desktop is already running.
)

echo Setting Docker context to default...
docker context use default

echo Waiting for Docker to be ready...
set maxWait=300
set interval=5
set elapsed=0

:waitLoop
docker ps >nul 2>&1
if %errorlevel% equ 0 goto ready
echo Docker not ready yet, waiting...
timeout /t %interval% /nobreak >nul
set /a elapsed+=interval
if %elapsed% lss %maxWait% goto waitLoop
echo Timeout: Docker did not become ready within %maxWait% seconds.
pause
exit /b 1

:ready
echo Docker is ready!

set maxRetries=10
set retryCount=0

:composeLoop
set /a attempt=retryCount+1
echo Running docker compose up -d... ^(attempt %attempt%^)
docker compose -f ../docker-compose.yml up -d mysql > output.txt 2>&1
set exit_code=%errorlevel%
if %exit_code% equ 0 (
    echo Docker Compose started successfully.
    goto end
) else (
    findstr "unable to get image" output.txt >nul
    if %errorlevel% equ 0 (
        echo Error detected: unable to get image. Retrying in 5 seconds...
        timeout /t 5 /nobreak >nul
        set /a retryCount+=1
        goto composeLoop
    ) else (
        echo Failed with other error.
        type output.txt
        pause
        exit /b 1
    )
)

:end
echo Script completed.
pause
