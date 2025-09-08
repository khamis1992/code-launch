const { execSync } = require('child_process');

// Get git hash with fallback
const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'no-git-info';
  }
};

let commitJson = {
  hash: JSON.stringify(getGitHash()),
  version: JSON.stringify(process.env.npm_package_version),
};

console.log(`
🚀═══════════════════════════════════════🚀
       C O D E L A U N C H
      🌿  منصة التطوير الذكية  🌊
🚀═══════════════════════════════════════🚀
`);
console.log('📍 الإصدار الحالي:', `v${commitJson.version}`);
console.log('📍 رقم الإصدار:', commitJson.hash);
console.log('  🎯 انتظر قليلاً حتى يظهر الرابط هنا');
console.log('🚀═══════════════════════════════════════🚀');
