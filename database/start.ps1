# PowerShell script to start Docker Desktop and run docker compose up -d

# Check if .env file exists
if (!(Test-Path .env)) {
    # Prompt for MySQL environment variables
    $MYSQL_ROOT_PASSWORD = Read-Host "Enter the MySQL root password" -AsSecureString
    $MYSQL_USER = Read-Host "Enter the MySQL user username"
    $MYSQL_PASSWORD = Read-Host "Enter the MySQL user password" -AsSecureString

    # Fixed MySQL database
    $MYSQL_DATABASE = "users_db"

    # Convert secure strings to plain text
    $rootPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($MYSQL_ROOT_PASSWORD))
    $userPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($MYSQL_PASSWORD))

    # Create .env file
    $content = @"
MYSQL_ROOT_PASSWORD=$rootPass
MYSQL_DATABASE=$MYSQL_DATABASE
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$userPass
"@

    $content | Out-File -FilePath .env -Encoding UTF8

    Write-Host ".env file created successfully."
} else {
    Write-Host ".env file already exists. Skipping creation."
}

# Path to Docker Desktop executable (adjust if installed elsewhere)
$dockerDesktopPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Start Docker Desktop if not already running
if (-not (Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Host "Starting Docker Desktop..."
    try {
        Start-Process $dockerDesktopPath -ErrorAction Stop
    } catch {
        Write-Host "Error: Failed to start Docker Desktop. $($_.Exception.Message)"
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "Docker Desktop is already running."
}

# Set Docker context to default
Write-Host "Setting Docker context to default..."
try {
    docker context use default
} catch {
    Write-Host "Warning: Failed to set Docker context. $($_.Exception.Message)"
}

# Wait for Docker to be ready
Write-Host "Waiting for Docker to be ready..."
$maxWaitTime = 300  # Maximum wait time in seconds (5 minutes)
$waitInterval = 5   # Check every 5 seconds
$elapsed = 0

while ($elapsed -lt $maxWaitTime) {
    try {
        # Attempt to run docker ps to check if Docker engine is fully responsive
        $null = docker ps 2>&1
        Write-Host "Docker is ready!"
        break
    } catch {
        Write-Host "Docker not ready yet, waiting..."
        Start-Sleep -Seconds $waitInterval
        $elapsed += $waitInterval
    }
}

if ($elapsed -ge $maxWaitTime) {
    Write-Host "Timeout: Docker did not become ready within $maxWaitTime seconds."
    Read-Host "Press Enter to exit"
    exit 1
}

# Additional wait to ensure full startup
Write-Host "Waiting an additional 10 seconds for full Docker startup..."
Start-Sleep -Seconds 10

# Run docker compose up -d with retry if "unable to get image" error
$maxRetries = 10
$retryCount = 0
$success = $false

while ($retryCount -lt $maxRetries -and -not $success) {
    Write-Host "Running docker compose up -d... (attempt $($retryCount + 1))"
    try {
        $output = docker compose up -d 2>&1
        if ($output -like "*unable to get image*") {
            Write-Host "Error detected: unable to get image. Retrying in 5 seconds..."
            Start-Sleep -Seconds 5
            $retryCount++
        } else {
            Write-Host "Docker Compose started successfully."
            $success = $true
        }
    } catch {
        Write-Host "Error: Failed to run docker compose up -d. $($_.Exception.Message)"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

if (-not $success) {
    Write-Host "Failed to run docker compose up -d after $maxRetries attempts."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Script completed."
Read-Host "Press Enter to exit"
