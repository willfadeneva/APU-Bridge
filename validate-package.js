const fs = require('fs');
try {
    JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    console.log('✅ package.json is valid JSON');
} catch (e) {
    console.error('❌ Invalid package.json:', e.message);
}