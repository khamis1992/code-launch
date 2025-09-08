#!/bin/bash

# استبدال مراجع bolt
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) -not -path "./node_modules/*" -exec sed -i 's/bolt\.diy/codelaunch.ai/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) -not -path "./node_modules/*" -exec sed -i 's/Bolt\.diy/CodeLaunch.ai/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) -not -path "./node_modules/*" -exec sed -i 's/bolt-/codelaunch-/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) -not -path "./node_modules/*" -exec sed -i 's/boltHistory/codeLaunchHistory/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) -not -path "./node_modules/*" -exec sed -i 's/useBoltHistoryDB/useCodeLaunchHistoryDB/g' {} \;

# استبدال مراجع stackblitz-labs
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) -not -path "./node_modules/*" -exec sed -i 's/stackblitz-labs/khamis1992/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) -not -path "./node_modules/*" -exec sed -i 's/StackBlitz/CodeLaunch/g' {} \;

# استبدال مراجع Bolt بـ CodeLaunch
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) -not -path "./node_modules/*" -exec sed -i 's/You are Bolt,/You are CodeLaunch AI,/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" -o -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) -not -path "./node_modules/*" -exec sed -i 's/created by StackBlitz/created by CodeLaunch Team/g' {} \;

echo "تم استبدال جميع المراجع بنجاح!"
