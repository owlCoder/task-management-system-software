# Get all subdirectories with package.json under infrastructure and infrastructure/microservices
$services = @()
$services += Get-ChildItem -Path "infrastructure" -Directory | Where-Object { Test-Path "$($_.FullName)\package.json" }
$services += Get-ChildItem -Path "infrastructure/microservices" -Directory | Where-Object { Test-Path "$($_.FullName)\package.json" }

# Build Windows Terminal command with multiple tabs
$wtCommand = ""
$serviceList = ""
$i = 0
foreach ($service in $services) {
    $path = $service.FullName
    $name = $service.Name

    $envExists = Test-Path "$path\.env"

    $serviceList += "$name"
    if (-not $envExists) {
        $serviceList += " [91m- WARNING: .ENV FILE MISSING IN SERVICE! CREATE IT!!![0m"
    }
    $serviceList += "`n"

    # Microservice tabs , with npm install before npm run dev
    $wtCommand += " ; new-tab cmd.exe /k `"echo $name && cd /d $path && npm i && npm run dev`""
    $i++
}
$wtCommand = $wtCommand.TrimStart(" ; ")

# Add a first tab with the service list using echo (cmd) and set tab title
$serviceListCmd = $serviceList -replace "`n", " & echo "
$wtCommand = "new-tab --title `"Opened Services`" cmd.exe /k `"echo ===================== Opened Services In The Following Order ===================== & echo $serviceListCmd`" & echo ================================================================================== ; " + $wtCommand

# Add focus to the first tab (Opened Services) at the end
$wtCommand += " ; focus-tab -t 0"

# Start all in one Windows Terminal window with tabs
Start-Process -FilePath "wt.exe" -ArgumentList $wtCommand

Write-Host "All services started in Windows Terminal tabs."