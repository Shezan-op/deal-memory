import fs from "fs";
import path from "path";

const FORBIDDEN_WORDS = [
  /\bhackathon\b/i,
  /\bcompetition\b/i,
  /\bcontest\b/i,
  /\bjudges\b/i,
  /\bjudging\b/i,
  /\bprizes?\b/i
];

const REQUIRED_ARTICLE_LINKS = [
  "https://github.com/vectorize-io/hindsight",
  "https://hindsight.vectorize.io/",
  "https://vectorize.io/what-is-agent-memory"
];

function checkFile(filePath: string, minWords = 0, maxWords = Infinity, maxChars = Infinity, checkForbidden = true) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const chars = content.length;

  let hasErrors = false;

  console.log(`\n📄 Checking ${path.relative(process.cwd(), filePath)}`);
  console.log(`   Words: ${words}, Characters: ${chars}`);

  if (words < minWords || words > maxWords) {
    console.error(`   ❌ Word count out of bounds! Range: [${minWords}, ${maxWords}], Found: ${words}`);
    hasErrors = true;
  } else if (minWords > 0) {
    console.log(`   ✅ Word count valid [${minWords} - ${maxWords}]`);
  }

  if (chars > maxChars) {
    console.error(`   ❌ Character count exceeded! Max: ${maxChars}, Found: ${chars}`);
    hasErrors = true;
  } else if (maxChars < Infinity) {
    console.log(`   ✅ Character count valid (< ${maxChars})`);
  }

  if (checkForbidden) {
    let foundForbidden = false;
    for (const regex of FORBIDDEN_WORDS) {
      const match = content.match(regex);
      if (match) {
        console.error(`   ❌ Forbidden term detected: "${match[0]}"`);
        foundForbidden = true;
        hasErrors = true;
      }
    }
    if (!foundForbidden) {
      console.log(`   ✅ No forbidden terms found`);
    }
  }

  return !hasErrors;
}

function checkArticleLinks(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  let valid = true;

  console.log(`\n🔗 Verifying Required Links in ${path.relative(process.cwd(), filePath)}`);
  for (const link of REQUIRED_ARTICLE_LINKS) {
    if (!content.includes(link)) {
      console.error(`   ❌ Missing required link: ${link}`);
      valid = false;
    } else {
      console.log(`   ✅ Link present: ${link}`);
    }
  }
  return valid;
}

function main() {
  console.log("=========================================");
  console.log("   DEALMEMORY CONTENT SUBMISSION AUDIT   ");
  console.log("=========================================");

  const teamMembers = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/team-members.json"), "utf-8"));
  let allPassed = true;

  for (const member of teamMembers) {
    console.log(`\n=========================================`);
    console.log(`Auditing assets for: ${member.name} (${member.role})`);
    console.log(`Angle: ${member.angle}`);
    console.log(`=========================================`);

    const artPath = path.join(process.cwd(), member.articleFile);
    const socPath = path.join(process.cwd(), member.socialFile);

    const artOk = checkFile(artPath, 800, 1500, Infinity, true);
    const linksOk = checkArticleLinks(artPath);
    if (!artOk || !linksOk) allPassed = false;

    const socOk = checkFile(socPath, 0, Infinity, 800, true);
    if (!socOk) allPassed = false;
  }

  const videoScriptPath = path.join(process.cwd(), "content/video/video-script.md");
  const videoOk = checkFile(videoScriptPath, 100, 1000, Infinity, false);
  if (!videoOk) allPassed = false;

  console.log("\n=========================================");
  if (allPassed) {
    console.log("✅ ALL CONTENT VALIDATION CHECKS PASSED!");
    console.log("   The submission assets comply with all rules.");
    console.log("=========================================\n");
    process.exit(0);
  } else {
    console.error("❌ CONTENT VALIDATION FAILED! Fix issues listed above.");
    console.log("=========================================\n");
    process.exit(1);
  }
}

main();
