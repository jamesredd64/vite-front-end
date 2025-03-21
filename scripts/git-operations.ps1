# In your backup repository
# 1. Get the commit hashes you want to transfer
git log --oneline

# 2. Copy those hashes, then switch to your main repository
cd path/to/main/repo

# 3. Create a new branch for the changes
git checkout -b import-backup

# 4. Cherry-pick the commits you want
git cherry-pick <commit-hash1> <commit-hash2>

# 5. Push the changes to your main repository
git push origin import-backup

function Import-FromBackup {
    Write-Host "Import changes from backup repository"
    Write-Host "1: Add main repository as remote"
    Write-Host "2: Push current branch to main repository"
    Write-Host "3: Cherry-pick specific commits"
    Write-Host "4: Cancel"
    
    $importChoice = Read-Host "Choose import method"
    switch ($importChoice) {
        '1' {
            $mainRepoUrl = Read-Host "Enter main repository URL"
            git remote add main $mainRepoUrl
            Write-Host "Main repository added as remote"
        }
        '2' {
            $branchName = git rev-parse --abbrev-ref HEAD
            $targetBranch = Read-Host "Enter target branch name for main repository"
            git push main "${branchName}:${targetBranch}"
            Write-Host "Changes pushed to main repository"
        }
        '3' {
            Write-Host "Recent commits:"
            git log --oneline -n 10
            $commits = Read-Host "Enter commit hashes to cherry-pick (space-separated)"
            $commits.Split(' ') | ForEach-Object {
                git cherry-pick $_
            }
        }
    }
}

# Add this to your main menu
function Show-GitMenu {    
    Clear-Host
    Write-Host "================ Git Operations Menu ================"    
    # ... existing menu items ...
    Write-Host "11: Import from backup repository"
    Write-Host "Q: Quit"
    Write-Host "=================================================="
}

# Add this to your main switch statement
switch ($selection) {
    # ... existing cases ...
    '11' { Import-FromBackup }
}
