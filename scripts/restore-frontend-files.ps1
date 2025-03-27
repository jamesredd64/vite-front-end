# Script to restore frontend files from fe-saved back to root

$sourcePath = Join-Path $PWD "fe-saved"
$targetPath = $PWD

if (!(Test-Path -Path $sourcePath)) {
    Write-Host "Error: fe-saved directory not found"
    exit 1
}

Write-Host "Restoring frontend files from fe-saved to root directory..."

# Move all contents back
Get-ChildItem -Path $sourcePath -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($sourcePath.Length + 1)
    $targetFile = Join-Path $targetPath $relativePath
    $targetDir = Split-Path $targetFile -Parent

    if (!(Test-Path -Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir | Out-Null
    }

    Write-Host "Restoring file: $relativePath"
    Move-Item $_.FullName -Destination $targetFile -Force
}

# Clean up empty directories
Remove-Item $sourcePath -Recurse -Force

Write-Host "Frontend files have been restored to the root directory"