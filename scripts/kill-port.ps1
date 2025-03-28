param(
    [Parameter(Mandatory=$true)]
    [int]$Port
)

$processInfo = netstat -ano | findstr ":$Port"
if ($processInfo) {
    $processId = $processInfo.Split(' ')[-1]
    try {
        Stop-Process -Id $processId -Force
        Write-Host "Successfully killed process using port $Port (PID: $processId)"
    }
    catch {
        Write-Host "Failed to kill process. Try running as administrator."
    }
}
else {
    Write-Host "No process found using port $Port"
}