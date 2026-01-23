#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    # Prompt for MySQL environment variables
    echo "Enter the MySQL root password:"
    read -s MYSQL_ROOT_PASSWORD
    echo "Enter the MySQL user username:"
    read MYSQL_USER
    echo "Enter the MySQL user password:"
    read -s MYSQL_PASSWORD

    # Fixed MySQL database
    MYSQL_DATABASE=users_db

    # Create .env file
    cat > .env << EOF
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=$MYSQL_DATABASE
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASSWORD
EOF

    echo ".env file created successfully."
else
    echo ".env file already exists. Skipping creation."
fi

# Bash script to start Docker daemon on Linux (for aarch64) and run docker compose up -d

# Linux logic
echo "On Linux, assuming Docker daemon is managed by systemd. Attempting to start Docker..."
docker_cmd="sudo docker"
if ! systemctl is-active --quiet docker; then
    sudo systemctl start docker
    if [ $? -ne 0 ]; then
        echo "Warning: Failed to start Docker daemon. Ensure it's installed and you have permissions."
    fi
fi

# Set Docker context to default
echo "Setting Docker context to default..."
$docker_cmd context use default 2>/dev/null || echo "Warning: Failed to set Docker context."

# Wait for Docker to be ready
echo "Waiting for Docker to be ready..."
maxWaitTime=300  # Maximum wait time in seconds (5 minutes)
waitInterval=5    # Check every 5 seconds
elapsed=0

while [ $elapsed -lt $maxWaitTime ]; do
    if $docker_cmd ps >/dev/null 2>&1; then
        echo "Docker is ready!"
        break
    else
        echo "Docker not ready yet, waiting..."
        sleep $waitInterval
        elapsed=$((elapsed + waitInterval))
    fi
done

if [ $elapsed -ge $maxWaitTime ]; then
    echo "Timeout: Docker did not become ready within $maxWaitTime seconds."
    read -p "Press Enter to exit"
    exit 1
fi

# Run docker compose up -d with retry if "unable to get image" error
maxRetries=10
retryCount=0
success=false

while [ $retryCount -lt $maxRetries ] && [ "$success" = false ]; do
    echo "Running docker compose up -d... (attempt $((retryCount + 1)))"
    output=$($docker_cmd compose -f ../docker-compose.yml up -d mysql 2>&1)
    exit_code=$?
    if [ $exit_code -eq 0 ]; then
        echo "Docker Compose started successfully."
        success=true
    elif echo "$output" | grep -q "unable to get image"; then
        echo "Error detected: unable to get image. Retrying in 5 seconds..."
        sleep 5
        retryCount=$((retryCount + 1))
    else
        echo "Failed with other error: $output"
        success=false
    fi
done

if [ "$success" = false ]; then
    echo "Failed to run docker compose up -d after $maxRetries attempts."
    read -p "Press Enter to exit"
    exit 1
fi

echo "Script completed."
read -p "Press Enter to exit"
