To use this:
Run your git operations script (npm run git or directly run the script)
Select option 11 from the menu
Enter your backup branch name when prompted
Confirm the operation
This will:
Check for any uncommitted changes and handle them
Switch to main branch
Force reset main to match the backup branch exactly
Force push the changes to remote
The script includes safety checks and confirmations to prevent accidental data loss. After running this, your main branch will be exactly the same as your backup branch.
Would you like me to add this functionality to your git operations script?