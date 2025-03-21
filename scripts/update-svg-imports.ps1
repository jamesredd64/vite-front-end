# Script to update SVG imports in React components

function Show-Menu {
    Clear-Host
    Write-Host "================ SVG Import Update Tool ================"
    Write-Host "1: Run automatic conversion (recommended)"
    Write-Host "2: Show files that will be affected"
    Write-Host "3: Backup files before conversion"
    Write-Host "4: Run prettier/eslint after conversion"
    Write-Host "Q: Quit"
    Write-Host "==================================================="
}

function Get-AffectedFiles {
    Write-Host "Searching for SVG imports..."
    
    # More specific patterns to catch different import styles
    $patterns = @(
        'import.*{.*}.*from.*\.svg[''"]', # Matches named imports like: import { ReactComponent as Icon } from './icon.svg'
        'import.*from.*\.svg[''"](?!\?react)', # Matches any SVG import that doesn't already have ?react
        'require\(.*\.svg[''"]' # Matches require statements
    )
    
    $files = @()
    foreach ($pattern in $patterns) {
        $found = Get-ChildItem -Path ".\src" -Recurse -Include "*.tsx","*.ts","*.jsx","*.js" | 
            Select-String -Pattern $pattern
        
        if ($found) {
            $files += $found | Select-Object Path, Line, LineNumber
        }
    }
    
    if ($files.Count -eq 0) {
        Write-Host "No SVG imports found that need updating."
        return $null
    }
    
    Write-Host "`nFound $($files.Count) SVG imports that need updating:"
    foreach ($file in $files) {
        Write-Host "`nFile: $($file.Path)"
        Write-Host "Line $($file.LineNumber): $($file.Line)"
    }
    
    return $files
}

function Get-RelativePath($from, $to) {
    $fromPath = [System.IO.Path]::GetFullPath($from)
    $toPath = [System.IO.Path]::GetFullPath($to)
    
    $fromUri = New-Object -TypeName System.Uri -ArgumentList $fromPath
    $toUri = New-Object -TypeName System.Uri -ArgumentList $toPath
    
    $relativeUri = $fromUri.MakeRelativeUri($toUri)
    $relativePath = [System.Uri]::UnescapeDataString($relativeUri.ToString())
    
    return $relativePath.Replace('/', '\')
}

function Backup-Files {
    try {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupDir = Join-Path $PWD "backup_$timestamp"
        
        # Create backup directory
        if (!(Test-Path -LiteralPath $backupDir)) {
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        }
        
        Get-AffectedFiles | ForEach-Object {
            $sourcePath = $_.Path
            $relativePath = Get-RelativePath $PWD $sourcePath
            $destPath = Join-Path $backupDir $relativePath
            $destDir = Split-Path -Parent $destPath
            
            # Create destination directory if it doesn't exist
            if (!(Test-Path -LiteralPath $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            
            # Copy the file
            Copy-Item -LiteralPath $sourcePath -Destination $destPath -Force
        }
        
        Write-Host "Backup created in: $backupDir"
        return $true
    }
    catch {
        Write-Host "Error creating backup: $_"
        return $false
    }
}

function Run-Conversion {
    try {
        $affectedFiles = Get-AffectedFiles
        if ($null -eq $affectedFiles) {
            Write-Host "No files to convert."
            return $false
        }
        
        $codemodPath = Join-Path $PWD "node_modules\vite-plugin-svgr\codemods\src\v4\default-export\default-export.js"
        
        if (!(Test-Path -LiteralPath $codemodPath)) {
            Write-Host "Error: Could not find codemod script at: $codemodPath"
            Write-Host "Please ensure vite-plugin-svgr is installed."
            return $false
        }

        Write-Host "`nRunning conversion with jscodeshift..."
        Write-Host "Using codemod at: $codemodPath"
        
        # Run the conversion
        $result = npx jscodeshift@latest ./src/ --extensions=ts,tsx,js,jsx --parser=tsx --transform="$codemodPath" --verbose=2
        
        Write-Host $result
        
        Write-Host "`nConversion attempt completed. Please check the files for changes."
        return $true
    }
    catch {
        Write-Host "Error during conversion: $_"
        Write-Host "Stack trace: $($_.ScriptStackTrace)"
        return $false
    }
}

function Run-CodeFormatting {
    Write-Host "Running code formatting..."
    
    try {
        # Run prettier
        Write-Host "Running prettier..."
        npm run prettier -- --write "src/**/*.{ts,tsx}"
        
        # Run eslint
        Write-Host "Running eslint..."
        npm run lint -- --fix
        
        Write-Host "Code formatting completed successfully!"
    }
    catch {
        Write-Host "Error during code formatting: $_"
    }
}

# Main loop
do {
    Show-Menu
    $selection = Read-Host "Please make a selection"
    
    switch ($selection) {
        '1' {
            Write-Host "`nStarting automatic conversion..."
            $affected = Get-AffectedFiles
            Write-Host "Found $($affected.Count) files with SVG imports"
            
            $confirm = Read-Host "Do you want to proceed? (y/n)"
            if ($confirm -eq 'y') {
                if (Backup-Files) {
                    if (Run-Conversion) {
                        $formatConfirm = Read-Host "Do you want to run code formatting? (y/n)"
                        if ($formatConfirm -eq 'y') {
                            Run-CodeFormatting
                        }
                    }
                }
            }
        }
        '2' {
            Write-Host "`nFiles that will be affected:"
            Get-AffectedFiles | ForEach-Object {
                Write-Host $_.Path
            }
        }
        '3' {
            Backup-Files
        }
        '4' {
            Run-CodeFormatting
        }
    }
    
    if ($selection -ne 'q') {
        Write-Host "`nPress any key to continue..."
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    }
} until ($selection -eq 'q')