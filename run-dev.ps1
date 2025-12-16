# This script starts the backend and the customer-facing frontend for the AutoTechnix project.
# It will open two new PowerShell windows, one for each process.

$backendPort = $env:PORT -as [int]
if (-not $backendPort) {
    $backendPort = 5000
}
$backendUrl = "http://localhost:$backendPort"
$backendReady = $false
$timeoutSeconds = 60
$sw = [System.Diagnostics.Stopwatch]::StartNew()

Write-Host "Starting backend server in a new window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm install; Write-Host 'Backend dependencies installed. Starting server...'; npm start"

Write-Host "Waiting for backend server to start at $backendUrl..."
while (-not $backendReady -and $sw.Elapsed.TotalSeconds -lt $timeoutSeconds) {
    try {
        Invoke-WebRequest -Uri $backendUrl -UseBasicParsing -TimeoutSec 5 | Out-Null
        $backendReady = $true
        Write-Host "Backend server is up and running!"
    } catch {
        Write-Host "Backend not ready yet, retrying in 5 seconds..."
        Start-Sleep -Seconds 5
    }
}

if (-not $backendReady) {
    Write-Error "Backend server did not start within the allotted time. Exiting."
    exit 1
}

Write-Host "Starting React customer app in a new window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd react-customer; npm install; Write-Host 'Frontend dependencies installed. Starting app...'; npm start"

Write-Host "All processes launched. Close this window to terminate the launcher script."
