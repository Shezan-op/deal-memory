import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('    DEALMEMORY DOCUMENTATION CONSISTENCY CHECK      ');
console.log('====================================================\n');

let totalDocs = 0;
let passedDocs = 0;

function checkDocExists(relativePath: string) {
  totalDocs++;
  const fullPath = path.resolve(process.cwd(), relativePath);
  if (fs.existsSync(fullPath)) {
    passedDocs++;
    console.log(`[FOUND] ${relativePath}`);
  } else {
    console.error(`[MISSING] ${relativePath}`);
  }
}

// 1. Root & Core Operational Documentation
checkDocExists('README.md');
checkDocExists('SECURITY.md');
checkDocExists('internal-setup-guide.md');
checkDocExists('CHANGELOG.md');
checkDocExists('CONTRIBUTING.md');
checkDocExists('LICENSE');

// 2. Consolidated Technical Documentation Suite
const coreDocs = [
  'docs/ARCHITECTURE.md',
  'docs/API.md',
  'docs/ADR.md',
  'docs/DEMO-GUIDE.md',
  'docs/SECURITY-MANUAL.md',
  'docs/RUNBOOK.md'
];

for (const doc of coreDocs) {
  checkDocExists(doc);
}

// 3. GitHub Templates & Archive
checkDocExists('.github/PULL_REQUEST_TEMPLATE.md');
checkDocExists('.github/ISSUE_TEMPLATE/security.md');
checkDocExists('docs-archive');

console.log('\n----------------------------------------------------');
console.log(`DOCS SUMMARY: ${passedDocs}/${totalDocs} documents verified.`);
console.log('----------------------------------------------------');

if (passedDocs !== totalDocs) {
  console.error('\nDocumentation consistency check failed! Some files are missing.');
  process.exit(1);
} else {
  console.log('\nAll core documentation files exist and are verified!\n');
}
