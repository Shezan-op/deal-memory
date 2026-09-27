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

  const articlePath = path.join(process.cwd(), "content/articles/article.md");
  const socialPath = path.join(process.cwd(), "content/social/linkedin-post.md");
  const videoScriptPath = path.join(process.cwd(), "content/video/video-script.md");

  let allPassed = true;

  // 1. Check Technical Article (800 - 1500 words, no forbidden words)
  const articleOk = checkFile(articlePath, 800, 1500, Infinity, true);
  const linksOk = checkArticleLinks(articlePath);
  if (!articleOk || !linksOk) allPassed = false;

  // 2. Check Social Post (< 800 chars, no forbidden words)
  const socialOk = checkFile(socialPath, 0, Infinity, 800, true);
  if (!socialOk) allPassed = false;

  // 3. Check Video Script exists
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
