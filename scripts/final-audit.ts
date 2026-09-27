import fs from "fs";
import path from "path";
import { execSync } from "child_process";

interface AuditResult {
  category: string;
  name: string;
  status: "PASS" | "WARNING" | "FAIL";
  details?: string;
}

const results: AuditResult[] = [];

function check(category: string, name: string, fn: () => boolean | string) {
  try {
    const res = fn();
    if (typeof res === "string") {
      results.push({ category, name, status: "WARNING", details: res });
    } else if (res) {
      results.push({ category, name, status: "PASS" });
    } else {
      results.push({ category, name, status: "FAIL" });
    }
  } catch (err: any) {
    results.push({ category, name, status: "FAIL", details: err?.message || String(err) });
  }
}

console.log("=================================================");
console.log("       DEALMEMORY COMPREHENSIVE REPO AUDIT       ");
console.log("=================================================\n");

// 1. PROJECT & STRUCTURE
check("PROJECT", "package.json manifests exist", () => fs.existsSync("package.json"));
check("PROJECT", ".env.example exists", () => fs.existsSync(".env.example"));
check("PROJECT", "License exists (Apache-2.0)", () => fs.existsSync("LICENSE"));
check("PROJECT", "Changelog exists", () => fs.existsSync("CHANGELOG.md"));
check("PROJECT", "Contributing guide exists", () => fs.existsSync("CONTRIBUTING.md"));
check("PROJECT", "internal-setup-guide.md exists and is substantive", () => {
  const content = fs.readFileSync("internal-setup-guide.md", "utf-8");
  return content.length > 1000 && content.includes("Hindsight");
});
check("PROJECT", "README.md exists and is substantive", () => {
  const content = fs.readFileSync("README.md", "utf-8");
  return content.length > 500 && content.includes("Hindsight");
});

// 2. DOCUMENTATION
const requiredDocs = [
  "docs/PRD.md",
  "docs/SYSTEM-DESIGN.md",
  "docs/ARCHITECTURE.md",
  "docs/HINDSIGHT-DESIGN.md",
  "docs/MEMORY-TAXONOMY.md",
  "docs/DATASET-DESIGN.md",
  "docs/API.md",
  "docs/SECURITY.md",
  "docs/THREAT-MODEL.md",
  "docs/MEMORY-EVALUATION.md",
  "docs/DEMO-SCRIPT.md",
  "docs/RUNBOOK.md",
  "docs/CONTENT-SUBMISSION.md",
  "docs/CONTENT-GUIDE-INTEGRATION.md",
  "docs/HINDSIGHT-PROMPT-REVIEW.md",
  "docs/HACKATHON-ALIGNMENT.md",
  "docs/adr/ADR-001-Hindsight-as-Memory-Layer.md",
  "docs/adr/ADR-002-Bank-Isolation.md",
  "docs/adr/ADR-003-Outcome-Linked-Memory.md",
  "docs/adr/ADR-004-Evidence-First-Recommendations.md",
  "docs/adr/ADR-005-No-Secondary-Database-for-MVP.md",
  "docs/adr/ADR-006-Tight-Scope.md",
  "docs/adr/ADR-007-Memory-On-Off-Demonstration.md",
  "docs/adr/ADR-008-Synthetic-Dataset-Design.md"
];

for (const doc of requiredDocs) {
  check("DOCUMENTATION", `Exists: ${doc}`, () => fs.existsSync(doc));
}

// 3. FRONTEND UI & ROUTES
const requiredPages = [
  "src/app/page.tsx",
  "src/app/deals/page.tsx",
  "src/app/deals/[dealId]/page.tsx",
  "src/app/deals/[dealId]/timeline/page.tsx",
  "src/app/deals/[dealId]/prepare/page.tsx",
  "src/app/deals/[dealId]/memory/page.tsx",
  "src/app/learning-loop/page.tsx",
  "src/app/demo/page.tsx"
];

for (const page of requiredPages) {
  check("FRONTEND", `Route exists: ${page}`, () => fs.existsSync(page));
}

// 4. API ROUTES
const requiredApis = [
  "src/app/api/deals/route.ts",
  "src/app/api/deals/[dealId]/route.ts",
  "src/app/api/deals/[dealId]/prepare/route.ts",
  "src/app/api/deals/[dealId]/timeline/route.ts",
  "src/app/api/deals/[dealId]/memory/route.ts",
  "src/app/api/interactions/route.ts",
  "src/app/api/outcomes/route.ts",
  "src/app/api/demo/reset/route.ts"
];

for (const api of requiredApis) {
  check("API", `Endpoint exists: ${api}`, () => fs.existsSync(api));
}

// 5. CONTENT VALIDATION
check("CONTENT", "Submission content checks pass", () => {
  try {
    execSync("npx tsx scripts/check-content.ts", { stdio: "pipe" });
    return true;
  } catch (err: any) {
    return false;
  }
});

// 6. UNIT TESTS
check("TESTS", "Vitest suite passes", () => {
  try {
    execSync("npx vitest run", { stdio: "pipe" });
    return true;
  } catch (err: any) {
    return false;
  }
});

// 7. TYPECHECK
check("TYPESCRIPT", "tsc compilation passes", () => {
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    return true;
  } catch (err: any) {
    return false;
  }
});

// Print Results
const categories = Array.from(new Set(results.map(r => r.category)));

let allPass = true;
for (const cat of categories) {
  console.log(`\n--- ${cat} ---`);
  for (const r of results.filter(res => res.category === cat)) {
    const symbol = r.status === "PASS" ? "✅" : r.status === "WARNING" ? "⚠️" : "❌";
    console.log(`${symbol} [${r.status}] ${r.name}${r.details ? ` (${r.details})` : ""}`);
    if (r.status === "FAIL") allPass = false;
  }
}

console.log("\n=================================================");
if (allPass) {
  console.log("🎉 AUDIT PASSED: Repository is complete and release-ready!");
  console.log("=================================================\n");
  process.exit(0);
} else {
  console.error("❌ AUDIT FAILED: Resolve failing items above.");
  console.log("=================================================\n");
  process.exit(1);
}
