#!/usr/bin/env node

// Simple script to change the admin access code
// Usage: node change-admin-code.js <new-access-code>

const fs = require('fs');
const path = require('path');

function changeAdminCode(newCode) {
  const adminFile = path.join(__dirname, 'render-backend/src/routes/admin.js');
  
  try {
    // Read the current file
    let content = fs.readFileSync(adminFile, 'utf8');
    
    // Replace the access code
    const newContent = content.replace(
      /const validAccessCode = '[^']*';/,
      `const validAccessCode = '${newCode}';`
    );
    
    // Write back to file
    fs.writeFileSync(adminFile, newContent);
    
    console.log(`✅ Admin access code changed to: ${newCode}`);
    console.log('📝 Remember to commit and push this change:');
    console.log('   git add render-backend/src/routes/admin.js');
    console.log('   git commit -m "Update admin access code"');
    console.log('   git push origin main');
    
  } catch (error) {
    console.error('❌ Error changing admin code:', error);
  }
}

// Get the new access code from command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node change-admin-code.js <new-access-code>');
  console.log('Example: node change-admin-code.js mynewpassword123');
  process.exit(1);
}

const newAccessCode = args[0];

if (newAccessCode.length < 4) {
  console.error('❌ Access code must be at least 4 characters long');
  process.exit(1);
}

changeAdminCode(newAccessCode);
