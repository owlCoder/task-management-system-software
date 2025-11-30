# Get all subdirectories with package.json under infrastructure and infrastructure/microservices
$services = @()
$services += Get-ChildItem -Path "infrastructure" -Directory | Where-Object { Test-Path "$($_.FullName)\package.json" }
$services += Get-ChildItem -Path "infrastructure/microservices" -Directory | Where-Object { Test-Path "$($_.FullName)\package.json" }


function Get-WindowsTerminalWindowHandles {

    $handles = New-Object System.Collections.Generic.List[long]
    $callback = [Tms.WindowHelper+EnumWindowsProc]{
        param([IntPtr]$hWnd, [IntPtr]$lParam)

        if (-not [Tms.WindowHelper]::IsWindowVisible($hWnd)) {
            return $true
        }

        $classNameBuffer = New-Object System.Text.StringBuilder 256
        $className = $classNameBuffer.ToString()

        if ($className -eq "CASCADIA_HOSTING_WINDOW_CLASS") {
            $handles.Add($hWnd.ToInt64()) | Out-Null
        }

        return $true
    }

    [Tms.WindowHelper]::EnumWindows($callback, [IntPtr]::Zero) | Out-Null
    return $handles.ToArray()
}

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

    # Microservice tabs with npm install before npm run dev
    $wtCommand += " ; new-tab --title `"$name`" --suppressApplicationTitle cmd.exe /k `"echo $name && cd /d $path && npm i && npm run dev`""
    $i++
}
$wtCommand = $wtCommand.TrimStart(" ; ")

# Add a first tab with the service list using echo (cmd) and set tab title
$serviceListCmd = $serviceList -replace "`n", " & echo "
$wtCommand = "new-tab --title `"Opened Services`" --suppressApplicationTitle cmd.exe /k `"echo ===================== Opened Services In The Following Order ===================== & echo $serviceListCmd`" & echo ================================================================================== ; " + $wtCommand

# Add focus to the first tab (Opened Services) at the end
$wtCommand += " ; focus-tab -t 0"

# Capture any Windows Terminal processes that already exist so we only close the
# ones that were launched by this script.
$existingTerminalProcessIds = @(
    Get-Process -Name "WindowsTerminal" -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty Id
)

# Capture currently open Windows Terminal window handles so we can detect newly created windows
$existingTerminalWindowHandles = Get-WindowsTerminalWindowHandles

# Track existing Node.js/npm processes so we can kill residue we spawn
$existingNodeProcessIds = @(
    Get-Process -Name "node" -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty Id
)
$existingNpmProcessIds = @(
    Get-Process -Name "npm" -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty Id
)

# Start all in one Windows Terminal window with tabs
$wtProcess = Start-Process -FilePath "wt.exe" -ArgumentList $wtCommand -PassThru

# Determine which Windows Terminal process IDs belong to the new window. The
# initial wt.exe stub exits immediately, so we poll for the actual host process.
$launchedTerminalProcessIds = @()
$attempts = 0
do {
    Start-Sleep -Milliseconds 250
    $currentTerminalProcesses = @(
        Get-Process -Name "WindowsTerminal" -ErrorAction SilentlyContinue
    )
    if ($currentTerminalProcesses.Count -gt 0) {
        $launchedTerminalProcessIds = @(
            $currentTerminalProcesses |
            Where-Object { $existingTerminalProcessIds -notcontains $_.Id } |
            Select-Object -ExpandProperty Id
        )
    }
    $attempts++
} while ($launchedTerminalProcessIds.Count -eq 0 -and $attempts -lt 40)

if ($launchedTerminalProcessIds.Count -eq 0) {
    Write-Warning "Unable to detect the Windows Terminal window automatically. Use Ctrl+C and close it manually if needed."
}

try {
    Write-Host "All services started in Windows Terminal tabs. Press Enter to stop them."
    [void][System.Console]::ReadLine()
} finally {
    if ($wtProcess -and -not $wtProcess.HasExited) {
        Stop-Process -Id $wtProcess.Id -Force -ErrorAction SilentlyContinue
    }

    foreach ($terminalPid in $launchedTerminalProcessIds) {
        $terminalProcess = Get-Process -Id $terminalPid -ErrorAction SilentlyContinue
        if ($terminalProcess) {
            try {
                Stop-Process -Id $terminalPid -Force -ErrorAction SilentlyContinue
                Write-Host "Closed Windows Terminal instance (PID $terminalPid) and all child npm processes by PID cleanup."
            } catch {
                Write-Warning "Failed to stop Windows Terminal PID $terminalPid automatically. It may already be closed."
            }
        }
    }

    # Terminate any Node.js processes spawned by this script (npm run dev instances)
    $activeNodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    foreach ($nodeProcess in $activeNodeProcesses) {
        if ($existingNodeProcessIds -notcontains $nodeProcess.Id) {
            try {
                Stop-Process -Id $nodeProcess.Id -Force -ErrorAction SilentlyContinue
                Write-Host "Stopped residual node.exe (PID $($nodeProcess.Id))."
            } catch {
                Write-Warning "Failed to stop node.exe PID $($nodeProcess.Id). Terminate it manually if it is still running."
            }
        }
    }

    $activeNpmProcesses = Get-Process -Name "npm" -ErrorAction SilentlyContinue
    foreach ($npmProcess in $activeNpmProcesses) {
        if ($existingNpmProcessIds -notcontains $npmProcess.Id) {
            try {
                Stop-Process -Id $npmProcess.Id -Force -ErrorAction SilentlyContinue
                Write-Host "Stopped residual npm.exe (PID $($npmProcess.Id))."
            } catch {
                Write-Warning "Failed to stop npm.exe PID $($npmProcess.Id). Terminate it manually if it is still running."
            }
        }
    }
}

Write-Host "All services started in Windows Terminal tabs."