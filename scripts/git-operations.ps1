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
    Write-Host "13: Delete branch"
    Write-Host "15: Merge multiple branches into new branch"
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
    Write-Host "3: Apply stash"    
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
        '3' { 
            git stash list
            $stashIndex = Read-Host "Enter stash index to apply"
            # Fix: Properly format the stash reference
            $stashRef = "stash@{$stashIndex}"
            & git stash apply "$stashRef"
        }        
        '4' { git stash pop }
        '5' {            
            git stash list
            $stashIndex = Read-Host "Enter stash index to drop"            
            $stashRef = "stash@{$stashIndex}"
            & git stash drop "$stashRef"
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

function Delete-Branch {
    Write-Host "`nCurrent branch:"
    $currentBranch = git rev-parse --abbrev-ref HEAD
    Write-Host $currentBranch
    
    Write-Host "`nAvailable branches:"
    Get-BranchList
    
    $branchName = Read-Host "`nEnter branch name to delete"
    
    if ($branchName -eq $currentBranch) {
        Write-Host "Cannot delete the current branch. Please switch to a different branch first."
        return
    }
    
    Write-Host "`nDelete options:"
    Write-Host "1: Safe delete (only if branch is fully merged)"
    Write-Host "2: Force delete (WARNING: will delete even if not merged)"
    Write-Host "3: Cancel"
    
    $choice = Read-Host "Choose option"
    
    switch ($choice) {
        '1' {
            git branch -d $branchName
            if ($LASTEXITCODE -eq 0) {
                $deleteRemote = Read-Host "Branch deleted locally. Delete from remote too? (y/n)"
                if ($deleteRemote -eq 'y') {
                    git push origin --delete $branchName
                }
            }
        }
        '2' {
            Write-Host "WARNING: Force delete will remove the branch and all its unmerged changes"
            $confirm = Read-Host "Are you sure? (y/n)"
            if ($confirm -eq 'y') {
                git branch -D $branchName
                if ($LASTEXITCODE -eq 0) {
                    $deleteRemote = Read-Host "Branch deleted locally. Force delete from remote too? (y/n)"
                    if ($deleteRemote -eq 'y') {
                        git push origin --delete $branchName -f
                    }
                }
            }
        }
        default {
            Write-Host "Operation cancelled"
        }
    }
}

function Merge-MultipleBranches {
    # First, ensure we're up to date
    git fetch --all
    
    # Get current branch name for reference
    $currentBranch = git rev-parse --abbrev-ref HEAD
    Write-Host "`nCurrent branch: $currentBranch"
    
    # Show available branches
    Write-Host "`nAvailable branches:"
    git branch
    
    # Ask whether to use existing branch or create new one
    Write-Host "`nBranch Options:"
    Write-Host "1: Create new integration branch"
    Write-Host "2: Use existing branch"
    $branchChoice = Read-Host "Choose option"
    
    $newBranchName = ""
    switch ($branchChoice) {
        '1' {
            $newBranchName = Read-Host "Enter name for new integration branch"
            git checkout -b $newBranchName
        }
        '2' {
            $newBranchName = Read-Host "Enter name of existing branch"
            # Check if branch exists
            $branchExists = git show-ref --verify --quiet "refs/heads/$newBranchName"
            if ($LASTEXITCODE -eq 0) {
                git checkout $newBranchName
            } else {
                Write-Host "Branch '$newBranchName' does not exist. Creating new branch..."
                git checkout -b $newBranchName
            }
        }
    }
    
    # Get branches to merge
    $branchesToMerge = @()
    do {
        $branchName = Read-Host "`nEnter branch name to merge (or press Enter to finish)"
        if ($branchName) {
            $branchesToMerge += $branchName
        }
    } while ($branchName)
    
    # Merge each branch
    foreach ($branch in $branchesToMerge) {
        Write-Host "`nAttempting to merge $branch..."
        $mergeResult = git merge $branch --no-commit --no-ff 2>&1
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "`nConflicts detected in $branch. Options:"
            Write-Host "1: View conflicts"
            Write-Host "2: Abort merge"
            Write-Host "3: Resolve manually"
            Write-Host "4: Force merge (theirs)"
            Write-Host "5: Force merge (ours)"
            $choice = Read-Host "Choose option"
            
            switch ($choice) {
                '1' {
                    git status
                    Write-Host "`nConflict files:"
                    git diff --name-only --diff-filter=U
                    git merge --abort
                }
                '2' {
                    git merge --abort
                    Write-Host "Merge aborted"
                }
                '3' {
                    Write-Host "Please resolve conflicts manually, then:"
                    Write-Host "1. git add . "
                    Write-Host "2. git commit -m 'Merge $branch into $newBranchName'"
                }
                '4' {
                    # Force merge using their changes
                    git merge --abort
                    git merge -X theirs $branch --no-edit
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "Force merge failed. Trying alternative method..."
                        git merge --abort
                        git merge $branch -s recursive -X theirs --no-edit
                    }
                }
                '5' {
                    # Force merge using our changes
                    git merge --abort
                    git merge -X ours $branch --no-edit
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "Force merge failed. Trying alternative method..."
                        git merge --abort
                        git merge $branch -s recursive -X ours --no-edit
                    }
                }
            }
        } else {
            $commitMessage = Read-Host "Enter commit message for merging $branch"
            if (-not $commitMessage) {
                $commitMessage = "Merge $branch into $newBranchName"
            }
            git commit -m $commitMessage
        }
    }
    
    Write-Host "`nMerge process completed. Branch '$newBranchName' contains merged changes."
    Write-Host "You can review changes and push to remote when ready."
    
    $pushNow = Read-Host "Would you like to push this branch to remote? (y/n)"
    if ($pushNow -eq 'y') {
        git push -u origin $newBranchName
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
            git log --pretty=format:"%h %ad %an %s %d" --date=short --all -n 15
        }
        '11' { Reset-ToBackupBranch }
        '12' { Switch-Environment }
        '13' { Delete-Branch }
        '15' { Merge-MultipleBranches }
    }
    if ($selection -ne 'q') {
        Write-Host "`nPress any key to continue..."
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    }
} while ($selection -ne 'q')
