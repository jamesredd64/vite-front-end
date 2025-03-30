# Get all TSX and TS files recursively
$allFiles = Get-ChildItem -Path ".\src" -Recurse -Include "*.tsx", "*.ts"

Write-Host "`nSearching for image and icon references...`n"

foreach ($file in $allFiles) {
    $hasMatches = $false
    Write-Host "Searching in $($file.FullName):"
    
    # Search for image references using getImageUrl
    $imageUrlMatches = Select-String -Path $file.FullName -Pattern "getImageUrl\(['""].*['""]\)" -AllMatches
    if ($imageUrlMatches) {
        $hasMatches = $true
        Write-Host "  Image URL references:"
        foreach ($match in $imageUrlMatches) {
            Write-Host "    Line $($match.LineNumber): $($match.Line.Trim())"
        }
    }

    # Search for direct image references (if any still exist)
    $directImageMatches = Select-String -Path $file.FullName -Pattern "src=['""].*\.(png|jpg|jpeg|gif)['""]" -AllMatches
    if ($directImageMatches) {
        $hasMatches = $true
        Write-Host "  Direct image references:"
        foreach ($match in $directImageMatches) {
            Write-Host "    Line $($match.LineNumber): $($match.Line.Trim())"
        }
    }

    # Search for icon imports
    $iconImportMatches = Select-String -Path $file.FullName -Pattern "import\s+{\s*[^}]*Icon[^}]*}\s+from\s+['""]\.\.\/icons['""]" -AllMatches
    if ($iconImportMatches) {
        $hasMatches = $true
        Write-Host "  Icon imports from index:"
        foreach ($match in $iconImportMatches) {
            Write-Host "    Line $($match.LineNumber): $($match.Line.Trim())"
        }
    }

    # Search for direct SVG imports
    $svgImportMatches = Select-String -Path $file.FullName -Pattern "import.*from.*\.svg\?react['""]" -AllMatches
    if ($svgImportMatches) {
        $hasMatches = $true
        Write-Host "  Direct SVG imports:"
        foreach ($match in $svgImportMatches) {
            Write-Host "    Line $($match.LineNumber): $($match.Line.Trim())"
        }
    }

    # Search for icon usage in JSX/TSX
    $iconUsageMatches = Select-String -Path $file.FullName -Pattern "<[A-Za-z]*Icon[^>]*\/?\s*>" -AllMatches
    if ($iconUsageMatches) {
        $hasMatches = $true
        Write-Host "  Icon component usage:"
        foreach ($match in $iconUsageMatches) {
            Write-Host "    Line $($match.LineNumber): $($match.Line.Trim())"
        }
    }

    if (-not $hasMatches) {
        Write-Host "  No image or icon references found"
    }
    
    Write-Host ""
}




