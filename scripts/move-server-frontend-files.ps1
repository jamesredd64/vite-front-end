# Script to move frontend files from server directory to server/fe-saved

$serverPath = Join-Path $PWD "server"
$targetPath = Join-Path $serverPath "fe-saved"

# if (!(Test-Path -Path $serverPath)) {
#     Write-Host "Error: server directory not found"
#     exit 1
# }

# Create fe-saved directory if it doesn't exist
if (!(Test-Path -Path $targetPath)) {
    New-Item -ItemType Directory -Path $targetPath
    Write-Host "Created directory: $targetPath"
}

# Define frontend-related patterns and files
$frontendPatterns = @(
    "*.tsx",
    "*.jsx",
    "*.ts",
    "*.css",
    "*.scss",
    "*.svg",
    "*.png",
    "*.jpg",
    "*.jpeg",
    "*.gif",
    "*.ico",
    "index.html"
)

$frontendDirs = @(
    "components",
    "pages",
    "styles",
    "assets",
    "public",
    "src"
)

Write-Host "Starting frontend files identification and move process in server directory..."

# Move frontend directories from server
foreach ($dir in $frontendDirs) {
    $sourceDir = Join-Path $serverPath $dir
    if (Test-Path $sourceDir) {
        $targetDir = Join-Path $targetPath $dir
        Write-Host "Moving directory: $dir"
        Move-Item $sourceDir $targetDir -Force
    }
}

# Move individual frontend files from server
foreach ($pattern in $frontendPatterns) {
    Get-ChildItem -Path $serverPath -Filter $pattern -File | ForEach-Object {
        $relativePath = $_.Name
        $targetFile = Join-Path $targetPath $relativePath
        
        Write-Host "Moving file: $relativePath"
        Move-Item $_.FullName -Destination $targetFile -Force
    }
}

Write-Host "`nFrontend files have been moved from server directory to: $targetPath"