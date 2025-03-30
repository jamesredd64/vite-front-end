# Script to move images from frontend public directory to backend public directory

$frontendPublicPath = Join-Path $PWD "public"
$backendPublicPath = Join-Path $PWD "server" "public"
$backendImagesPath = Join-Path $backendPublicPath "images"

# Create backend public/images directory if it doesn't exist
if (!(Test-Path -Path $backendImagesPath)) {
    New-Item -ItemType Directory -Path $backendImagesPath -Force
    Write-Host "Created directory: $backendImagesPath"
}

# Copy all images from frontend public to backend public/images
Get-ChildItem -Path $frontendPublicPath -Include *.jpg,*.jpeg,*.png,*.gif,*.svg,*.webp -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Substring($frontendPublicPath.Length + 1)
    $destinationPath = Join-Path $backendImagesPath $relativePath
    $destinationDir = Split-Path -Parent $destinationPath
    
    # Create destination directory if it doesn't exist
    if (!(Test-Path -Path $destinationDir)) {
        New-Item -ItemType Directory -Path $destinationDir -Force
    }
    
    Copy-Item $_.FullName -Destination $destinationPath -Force
    Write-Host "Copied: $relativePath"
}