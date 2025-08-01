import { readFileSync } from 'fs';

try {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
  console.log('✅ package.json is valid JSON');
  process.exit(0);
} catch (e) {
  console.error('❌ Invalid package.json:', e.message);
  console.log('\n💡 Try checking:');
  console.log('- No comments (remove all // or /* */)');
  console.log('- All quotes must be double quotes (")');
  console.log('- No trailing commas after last item');
  process.exit(1);
}
