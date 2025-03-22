function Show-GitMenu {    
    Clear-Host
    Write-Host "================ Git Operations Menu ================"    
    Write-Host "1: List all branches"
    Write-Host "2: Switch branch"    
    Write-Host "3: Create and switch to new branch"
    Write-Host "4: Pull latest changes"    
    Write-Host "5: Reset changes"
    Write-Host "6: Stash operations"    
    Write-Host "7: Clean working directory"
    Write-Host "8: View status"    
    Write-Host "9: Push changes"
    Write-Host "10: View commit history"    
    Write-Host "Q: Quit"
    Write-Host "=================================================="
}

function Get-BranchList {
    Write-Host "`nLocal branches:"    
    git branch
    Write-Host "`nRemote branches:"    
    git branch -r
}

function Switch-Branch {    
    Get-BranchList
    $branchName = Read-Host "`nEnter branch name to switch to"    
    git checkout $branchName
}

function New-Branch {    
    $branchName = Read-Host "Enter new branch name"
    git checkout -b $branchName    
    $pushBranch = Read-Host "Do you want to push this branch to remote? (y/n)"
    if ($pushBranch -eq 'y') {        
        git push -u origin $branchName
    }
}

function Reset-Changes {
    Write-Host "Reset options:"    
    Write-Host "1: Soft reset (keep changes in working directory)"
    Write-Host "2: Hard reset (delete all changes)"    
    Write-Host "3: Reset to specific commit"
    Write-Host "4: Reset to commit from another project"
    Write-Host "5: Cancel"    
    
    $resetChoice = Read-Host "Choose reset type"    
    switch ($resetChoice) {
        '1' {            
            git reset --soft HEAD~1
            Write-Host "Soft reset completed. Changes are in working directory."        
        }
        '2' {            
            $confirm = Read-Host "WARNING: This will delete all changes. Continue? (y/n)"
            if ($confirm -eq 'y') {                
                git reset --hard HEAD
                Write-Host "Hard reset completed. All changes deleted."            
            }
        }        
        '3' {
            git log --oneline -n 10            
            $commitHash = Read-Host "Enter commit hash to reset to"
            $confirm = Read-Host "Reset to $commitHash? (y/n)"            
            if ($confirm -eq 'y') {
                git reset --hard $commitHash
                Write-Host "Reset completed."            
            }
        }
        '4' {
            $otherProjectPath = Read-Host "Enter the full path to the other project"
            if (Test-Path $otherProjectPath) {
                $currentPath = Get-Location
                Set-Location $otherProjectPath
                Write-Host "`nCommits in the other project:"
                git log --oneline -n 10
                $commitHash = Read-Host "`nEnter commit hash to use"
                Set-Location $currentPath
                
                # Add the other project as a remote if it's not already added
                $remoteName = "other-project"
                git remote remove $remoteName 2>$null
                git remote add $remoteName $otherProjectPath
                git fetch $remoteName
                
                $confirm = Read-Host "Reset to $commitHash? (y/n)"            
                if ($confirm -eq 'y') {
                    git reset --hard $commitHash
                    Write-Host "Reset completed. Code from other project has been imported."
                }
                
                # Clean up: remove the temporary remote
                git remote remove $remoteName
            } else {
                Write-Host "Error: Project path not found"
            }
        }    
    }
}

function Invoke-StashOperations {    
    Write-Host "Stash options:"
    Write-Host "1: Stash current changes"    
    Write-Host "2: List stashes"
    Write-Host "3: Apply latest stash"    
    Write-Host "4: Pop latest stash"
    Write-Host "5: Drop stash"    
    Write-Host "6: Cancel"
    
    $stashChoice = Read-Host "Choose stash operation"
    switch ($stashChoice) {        
        '1' {
            $stashName = Read-Host "Enter stash description (optional)"            
            if ($stashName) {
                git stash push -m $stashName            
            } else {
                git stash            
            }
        }        
        '2' { git stash list }
        '3' { git stash apply }        
        '4' { git stash pop }
        '5' {            
            git stash list
            $stashIndex = Read-Host "Enter stash index to drop"            
            git stash drop stash@{$stashIndex}
        }    
    }
}

function Clean-WorkingDirectory {    
    Write-Host "Clean options:"
    Write-Host "1: Show what would be deleted"    
    Write-Host "2: Delete untracked files"
    Write-Host "3: Delete untracked files and directories"    
    Write-Host "4: Cancel"
    
    $cleanChoice = Read-Host "Choose clean type"
    switch ($cleanChoice) {        
        '1' { git clean -n }
        '2' {            
            $confirm = Read-Host "This will delete all untracked files. Continue? (y/n)"
            if ($confirm -eq 'y') { git clean -f }        
        }
        '3' {            
            $confirm = Read-Host "This will delete all untracked files and directories. Continue? (y/n)"
            if ($confirm -eq 'y') { git clean -fd }        
        }
    }
}

function Push-Changes {
    $currentBranch = git rev-parse --abbrev-ref HEAD    
    Write-Host "Current branch: $currentBranch"
    $confirm = Read-Host "Push to this branch? (y/n)"    
    if ($confirm -eq 'y') {
        git push origin "$currentBranch"    
    } else {
        $targetBranch = Read-Host "Enter target branch name"        
        git push origin "${currentBranch}:${targetBranch}"
    }
}

# Main loop
do {
    Show-GitMenu
    $selection = Read-Host "Please make a selection"
    switch ($selection) {
        '1' { Get-BranchList }
        '2' { Switch-Branch }
        '3' { New-Branch }
        '4' { git pull }
        '5' { Reset-Changes }
        '6' { Invoke-StashOperations }
        '7' { Clean-WorkingDirectory }
        '8' { git status }
        '9' { Push-Changes }
        '10' { 
            Write-Host "`nCommit History (last 10 commits):"
            git log --oneline -n 10 
        }
    }
    if ($selection -ne 'q') {
        Write-Host "`nPress any key to continue..."
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    }
} while ($selection -ne 'q')
