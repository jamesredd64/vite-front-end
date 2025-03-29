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
    Write-Host "11: Overwrite main with backup branch"
    Write-Host "12: Switch Environment (Dev/Prod)"
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
    Write-Host "4: Cancel"    
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
                # First check if there are uncommitted changes
                $status = git status --porcelain
                if ($status) {
                    Write-Host "You have uncommitted changes. Please commit or stash them first."
                    Write-Host "Would you like to:"
                    Write-Host "1: Stash changes"
                    Write-Host "2: Force reset (lose changes)"
                    Write-Host "3: Cancel"
                    $choice = Read-Host "Choose option"
                    
                    switch ($choice) {
                        '1' {
                            git stash
                            git reset --hard $commitHash
                            Write-Host "Changes stashed and reset to $commitHash. Use 'git stash pop' to recover changes."
                        }
                        '2' {
                            git reset --hard $commitHash
                            git clean -fd
                            Write-Host "Force reset to $commitHash. All changes deleted."
                        }
                        default {
                            Write-Host "Reset cancelled"
                            return
                        }
                    }
                } else {
                    git reset --hard $commitHash
                    git clean -fd
                    Write-Host "Reset to $commitHash completed."
                }
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
        $pushCommand = "origin ${currentBranch}:${targetBranch}"
        git push $pushCommand
    }
}

function Reset-ToBackupBranch {
    $backupBranch = Read-Host "Enter the name of your backup branch"
    
    Write-Host "`nThis will completely overwrite main branch with $backupBranch"
    Write-Host "WARNING: This operation cannot be undone!"
    $confirm = Read-Host "Are you sure you want to continue? (y/n)"
    
    if ($confirm -eq 'y') {
        # First check if there are uncommitted changes
        $status = git status --porcelain
        if ($status) {
            Write-Host "You have uncommitted changes. Please commit or stash them first."
            Write-Host "Would you like to:"
            Write-Host "1: Stash changes"
            Write-Host "2: Force reset (lose changes)"
            Write-Host "3: Cancel"
            $choice = Read-Host "Choose option"
            
            switch ($choice) {
                '1' {
                    git stash
                }
                '2' {
                    git reset --hard HEAD
                    git clean -fd
                }
                default {
                    Write-Host "Operation cancelled"
                    return
                }
            }
        }
        
        # Perform the branch overwrite
        git checkout main
        git reset --hard $backupBranch
        git push --force origin main
        
        Write-Host "`nMain branch has been successfully overwritten with $backupBranch"
    } else {
        Write-Host "Operation cancelled"
    }
}

function Switch-Environment {
    Write-Host "`nSwitch between development and production environments"
    Write-Host "1: Switch to development"
    Write-Host "2: Switch to production (Vercel-ready)"
    
    $choice = Read-Host "Choose option"
    
    switch ($choice) {
        '1' {
            git checkout development
            Write-Host "Switched to development environment"
        }
        '2' {
            $confirm = Read-Host "This will switch to production-ready main branch. Continue? (y/n)"
            if ($confirm -eq 'y') {
                git checkout main
                Write-Host "Switched to production environment"
            }
        }
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
            Write-Host "`nAll Commits (including local):"
            Write-Host "Format: [Hash] [Date] [Author] [Message] [Branch/HEAD info]"
            Write-Host "--------------------------------------------------------"
            
            # Show all commits including local ones with branch/ref information
            git log --pretty=format:"%h %ad %an %s %d" --date=short --all -n 15
            
            Write-Host "`n"
            Write-Host "Local unpushed commits on current branch:"
            Write-Host "----------------------------------------"
            # Try different methods to show unpushed commits
            $unpushedCommits = git log '@{u}..' --pretty=format:"%h %ad %an %s" --date=short 2>$null
            if ($LASTEXITCODE -ne 0) {
                $unpushedCommits = git log 'origin/main..HEAD' --pretty=format:"%h %ad %an %s" --date=short 2>$null
            }
            
            if ($LASTEXITCODE -eq 0 -and $unpushedCommits) {
                Write-Host $unpushedCommits
            } else {
                Write-Host "All commits are in sync with remote repository."
            }
            
            Write-Host "`nTo roll back to any of these commits:"
            Write-Host "1. Copy the commit hash (first column)"
            Write-Host "2. Select option 5 from main menu"
            Write-Host "3. Choose option 3 (Reset to specific commit)"
            Write-Host "4. Paste the commit hash when prompted"
        }
        '11' { Reset-ToBackupBranch }
        '12' { Switch-Environment }
    }
    if ($selection -ne 'q') {
        Write-Host "`nPress any key to continue..."
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    }
} while ($selection -ne 'q')
