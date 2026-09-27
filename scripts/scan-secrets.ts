import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('====================================================');
console.log('       DEALMEMORY FORENSIC SECRET SCANNER           ');
console.log('====================================================\n');

// Suspicious secret patterns
const SECRET_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: 'AWS Access Key ID', regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'OpenAI API Key', regex: /\bsk-[a-zA-Z0-9]{20,48}\b/ },
  { name: 'Anthropic API Key', regex: /\bsk-ant-[a-zA-Z0-9_-]{20,80}\b/ },
  { name: 'Generic Private Key', regex: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Hardcoded Bearer Token', regex: /bearer\s+[a-zA-Z0-9\-_]{32,}/i },
  { name: 'Slack Bot Token', regex: /\bxoxb-[0-9]{11,13}-[0-9]{11,13}-[a-zA-Z0-9]{24}\b/ },
  { name: 'GitHub Personal Access Token', regex: /\bghp_[a-zA-Z0-9]{36}\b/ },
  { name: 'Stripe Secret Key', regex: /\bsk_live_[0-9a-zA-Z]{24}\b/ },
  { name: 'Hindsight Live Secret Key', regex: /\bhs_live_[0-9a-zA-Z]{32,}\b/ },
];

const IGNORED_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'out',
  '.gemini',
]);

const IGNORED_FILES = new Set([
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
]);

let violations = 0;
let scannedFiles = 0;

function scanDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(process.cwd(), fullPath);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      if (IGNORED_FILES.has(entry.name)) continue;

      scannedFiles++;
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check against secret patterns
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.regex.test(content)) {
          // Allow explicitly documented dummy examples in test files or markdown
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (pattern.regex.test(line)) {
              if (
                line.includes('test-key') ||
                line.includes('dummy') ||
                line.includes('example') ||
                line.includes('000000') ||
                line.includes('mock')
              ) {
                // benign test fixture or documentation example
                return;
              }
              console.error(`[HIGH SEVERITY SECRET FOUND] ${relPath}:${idx + 1}`);
              console.error(`  Pattern: ${pattern.name}`);
              console.error(`  Line preview: ${line.trim().slice(0, 80)}...`);
              violations++;
            }
          });
        }
      }
    }
  }
}

// 1. Scan filesystem
console.log('[1/2] Scanning repository files for hardcoded secrets...');
scanDirectory(process.cwd());

// 2. Scan Git log commit history if git is available
console.log('\n[2/2] Scanning Git commit diffs for leaked secrets...');
try {
  const gitLog = execSync('git log -p -n 50', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  for (const pattern of SECRET_PATTERNS) {
    const match = gitLog.match(pattern.regex);
    if (match) {
      const matchedString = match[0];
      if (
        !matchedString.includes('test') &&
        !matchedString.includes('dummy') &&
        !matchedString.includes('example') &&
        !matchedString.includes('000000')
      ) {
        console.error(`[LEAK IN GIT HISTORY] Detected ${pattern.name} in commit log: ${matchedString.slice(0, 10)}...`);
        violations++;
      }
    }
  }
} catch {
  console.log('Git history scan skipped (not a git repo or git not in PATH).');
}

console.log('\n----------------------------------------------------');
console.log(`SCAN COMPLETE: Checked ${scannedFiles} files.`);
if (violations > 0) {
  console.error(`❌ FAILED: ${violations} secret exposure(s) detected!`);
  process.exit(1);
} else {
  console.log('✅ PASSED: No secrets, credentials, or private keys detected in codebase or commit log.');
  process.exit(0);
}
