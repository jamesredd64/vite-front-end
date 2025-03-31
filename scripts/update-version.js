const fs = require('fs');
const path = require('path');

const updateVersion = () => {
  const versionPath = path.join(__dirname, '../src/config/version.ts');
  const content = fs.readFileSync(versionPath, 'utf8');
  
  // Extract current version
  const versionMatch = content.match(/number: '(\d+\.\d+\.\d+)'/);
  if (!versionMatch) throw new Error('Version pattern not found');
  
  const currentVersion = versionMatch[1];
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  // Increment patch version
  const newVersion = `${major}.${minor}.${patch + 1}`;
  
  // Update file content
  const newContent = content.replace(
    /number: '\d+\.\d+\.\d+'/,
    `number: '${newVersion}'`
  );
  
  fs.writeFileSync(versionPath, newContent);
  console.log(`Version updated to ${newVersion}`);
  
  // Also update package.json
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = require(packagePath);
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
};

updateVersion();