# Script to move frontend files to fe-saved directory

$sourcePath = $PWD
$targetPath = Join-Path $sourcePath "fe-saved"

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
    "vite.config.ts",
    "tsconfig*.json",
    "postcss.config.js",
    "tailwind.config.js",
    "index.html",
    ".eslintrc*",
    ".prettierrc*"
)

$frontendDirs = @(
    "src",
    "public",
    "components",
    "pages",
    "styles",
    "assets",
    "hooks",
    "context",
    "utils",
    "types",
    "services",
    "features"
)

# Function to check if package.json is frontend-related
function Is-FrontendPackageJson($filePath) {
    $content = Get-Content $filePath -Raw | ConvertFrom-Json
    $frontendDeps = @(
        "react",
        "vite",
        "@vitejs",
        "@types/react",
        "tailwindcss",
        "postcss"
    )
    
    foreach ($dep in $frontendDeps) {
        if (($content.dependencies.PSObject.Properties.Name -match $dep) -or 
            ($content.devDependencies.PSObject.Properties.Name -match $dep)) {
            return $true
        }
    }
    return $false
}

# Function to copy directory structure
function Copy-DirectoryStructure($source, $destination) {
    $dirs = Get-ChildItem $source -Directory -Recurse
    foreach ($dir in $dirs) {
        $targetDir = $dir.FullName.Replace($source, $destination)
        if (!(Test-Path -Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir | Out-Null
        }
    }
}

Write-Host "Starting frontend files identification and move process..."

# Check and move frontend directories
foreach ($dir in $frontendDirs) {
    $sourceDir = Join-Path $sourcePath $dir
    if (Test-Path $sourceDir) {
        $targetDir = Join-Path $targetPath $dir
        Write-Host "Moving directory: $dir"
        Copy-DirectoryStructure $sourceDir $targetDir
        Get-ChildItem $sourceDir -Recurse -File | ForEach-Object {
            $targetFile = $_.FullName.Replace($sourcePath, $targetPath)
            Copy-Item $_.FullName -Destination $targetFile -Force
        }
        Remove-Item $sourceDir -Recurse -Force
    }
}

# Check and move frontend files
foreach ($pattern in $frontendPatterns) {
    Get-ChildItem -Path $sourcePath -Filter $pattern -Recurse | ForEach-Object {
        $relativePath = $_.FullName.Substring($sourcePath.Length + 1)
        $targetFile = Join-Path $targetPath $relativePath
        $targetDir = Split-Path $targetFile -Parent

        if (!(Test-Path -Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir | Out-Null
        }

        Write-Host "Moving file: $relativePath"
        Move-Item $_.FullName -Destination $targetFile -Force
    }
}

# Check package.json separately
$packageJsonPath = Join-Path $sourcePath "package.json"
if ((Test-Path $packageJsonPath) -and (Is-FrontendPackageJson $packageJsonPath)) {
    $targetPackageJson = Join-Path $targetPath "package.json"
    Write-Host "Moving frontend package.json"
    Move-Item $packageJsonPath -Destination $targetPackageJson -Force
}

Write-Host "`nFrontend files have been moved to: $targetPath"
Write-Host "Please verify the moved files and ensure no critical files were moved incorrectly."