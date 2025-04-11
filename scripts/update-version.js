const fs = require('fs');
const path = require('path');

const updateVersion = () => {
  try {
    const versionPath = path.join(process.cwd(), 'src/config/version.ts');
    const packagePath = path.join(process.cwd(), 'package.json');
    
    // Read package.json version
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const newVersion = packageJson.version;
    
    // Update version.ts
    const content = fs.readFileSync(versionPath, 'utf8');
    const newContent = content.replace(
      /number: '\d+\.\d+\.\d+'/,
      `number: '${newVersion}'`
    );
    
    fs.writeFileSync(versionPath, newContent, 'utf8');
    console.log('Version updated successfully:', newVersion);
  } catch (error) {
    console.error('Error updating version:', error);
    process.exit(1);
  }
};

updateVersion();
