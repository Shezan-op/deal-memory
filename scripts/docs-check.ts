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

// 1. Core Documentation
checkDocExists('README.md');
checkDocExists('SECURITY.md');
checkDocExists('docs/API.md');
checkDocExists('docs/ARCHITECTURE.md');
checkDocExists('docs/HINDSIGHT-DESIGN.md');
checkDocExists('docs/RUNBOOK.md');
checkDocExists('docs/DOCUMENTATION-IMPACT-MATRIX.md');
checkDocExists('docs/templates/SECURITY-CHANGE-TEMPLATE.md');
checkDocExists('.github/PULL_REQUEST_TEMPLATE.md');
checkDocExists('.github/ISSUE_TEMPLATE/security.md');
checkDocExists('internal-setup-guide.md');

// 2. Security Documentation Suite
const securityDocs = [
  'docs/security/README.md',
  'docs/security/SECURITY-STANDARDS.md',
  'docs/security/INITIAL-AUDIT.md',
  'docs/security/THREAT-MODEL.md',
  'docs/security/ASVS-CONTROL-MATRIX.md',
  'docs/security/AI-SECURITY.md',
  'docs/security/AGENTIC-SECURITY.md',
  'docs/security/SECURITY-BASELINE.md',
  'docs/security/DATA-FLOW.md',
  'docs/security/DATA-RETENTION.md',
  'docs/security/LOGGING-REDACTION.md',
  'docs/security/DEPENDENCY-POLICY.md',
  'docs/security/INCIDENT-RESPONSE.md',
  'docs/security/SECRET-ROTATION.md',
  'docs/security/SBOM.md',
  'docs/security/DEMO-SECURITY-CHECKLIST.md',
  'docs/security/SECURITY-TEST-PLAN.md',
  'docs/security/SECURITY-TEST-REPORT.md',
  'docs/security/SECURITY-CHANGELOG.md',
  'docs/security/SECURITY-EXCEPTIONS.md',
  'docs/security/SECURITY-MAINTENANCE.md',
  'docs/security/GITHUB-SECURITY-SETUP.md',
  'docs/security/BASELINE-SNAPSHOT.md',
  'docs/security/ATTACK-SURFACE-MAP.md',
  'docs/security/SECURITY-INVARIANTS.md',
  'docs/security/CHAOS-MATRIX.md',
  'docs/security/HINDSIGHT-SECURITY.md',
  'docs/security/MAINTENANCE-POLICY.md',
  'docs/security/FINAL-AUDIT.md',
];

for (const doc of securityDocs) {
  checkDocExists(doc);
}

console.log('\n----------------------------------------------------');
console.log(`DOCS SUMMARY: ${passedDocs}/${totalDocs} documents verified.`);
console.log('----------------------------------------------------');

if (passedDocs !== totalDocs) {
  console.error('\nDocumentation consistency check failed! Some files are missing.');
  process.exit(1);
} else {
  console.log('\nAll documentation files exist and are verified!\n');
}
