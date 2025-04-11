*****************************************************************************
## commit codes:
# Format: <type>(<scope>): <description>
## Examples
### git commit -m "feat(profile): add new user profile settings"
### git commit -m "fix(auth): resolve login timeout issue"
### git commit -m "docs(readme): update installation instructions"

_________________________________________________________________________
## Common types:
feat: New feature
fix: Bug fix
 docs: Documentation changes
style: Code style changes
refactor: Code refactoring
perf: Performance improvements
test: Adding tests
chore: Maintenance tasks
The changelog will automatically update when you:
Run npm run build
Make a new version with npm version patch/minor/major
Manually run npm run update-changelog

**********************************************************************************

## after rest hard must push to remote:
git push --force origin <branch-name>
5693db2
5693db2
## Create and switch to new branch
git checkout -b backup/admin-backup
**
 ## Add all changes
git add .
Commit changes -git commit -m "backup/admin-backup: Current changes"

## **Push backup to remote
git push -u origin backup/admin-backup


## ** SWITCH TO MAIN
git checkout main

## **SWITCH TO BACKUP
git checkout backup/admin-backup

## **VIEW BACKUP
### git log backup/your-changes

### git remote add origin https://github.com/jamesredd64/auth0-admin-react.git

## To roll back git code but keep local changes: 
### git reset --soft HEAD~1

## To rollback all changes:
 ### git reset --hard HEAD~1
### git push -f origin main  # Only if you need to update GitHub

## To create a new commit that undoes a previous commit use: 
### git revert HEAD    # Reverts the last commit
### git push origin main

## To See GIT History
### git log --oneline  # Shows commit history with shortened commit hashes

# Misc Git
NPM Set http:             npm config set registry http://registry.npmjs.org/

https://www.walmart.com/ip/Windows-11-Pro-Laptop-15-6inch-12th-Gen-Intel-N100-Processor-12GB-RAM-512GB-SSD-1920x1080-Wi-Fi-BT5-2/6144300102?athAsset=eyJhdGhjcGlkIjoiNjE0NDMwMDEwMiIsImF0aHN0aWQiOiJDUzA1NX5DUzAwNH5DUzA5OCIsImF0aGVlIjp7ImEiOjIwLjgsImIiOjYzOC4wLCJ3IjowLjAzODYyODYyMTQxMjcwNDg3LCJsIjowLjV9LCJhdGhwb3NiIjoiNCIsImF0aGFuY2lkIjoiMjU1NzYzMTM3OCJ9&athena=true&athbdg=L1700&adsRedirect=true
*****************************************************************************************
Remove item from git tracking

git rm --cached DemoApp.tsx
git commit -m "Remove DemoApp.tsx from git tracking"
git push
****************************************************************************************
Remove folder and all files

# 1. Remove the directory from Git tracking (keeps files on disk)
# Method 1: Using quotes (recommended) when name has spaces
git rm -r --cached "user cards"

# Method 2: Using backslash to escape the space
git rm -r --cached user\ cards

git rm -r --cached user cards

# 2. Commit the change
git commit -m "Remove user cards from git tracking"

# 3. Push changes
git push
************************************************************************************
            npm config set strict-ssl false

# The commands you already ran
git init
git add .
git commit -m "vercel ver"

# New commands to connect to GitHub
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main

# List all hidden items to find Git-related files
Get-ChildItem -Hidden

# Remove these Git-related items if they exist
Remove-Item -Force -Recurse -ErrorAction SilentlyContinue .git
Remove-Item -Force -ErrorAction SilentlyContinue .gitignore
Remove-Item -Force -ErrorAction SilentlyContinue .gitattributes

# Also check for any nested .git folders
Get-ChildItem -Hidden -Recurse -Filter ".git" | Select-Object FullName


# Initialize new Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit"

# Add your remote
git remote add origin https://github.com/YOUR-USERNAME/my-rec-gen.git

# Push to main branch
git branch -M main
git push -u origin main