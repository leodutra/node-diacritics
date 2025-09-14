const diacritics = require("./index.js");

function getAllCoveredCharacters(replacementList) {
  const allChars = new Set();
  replacementList.forEach((item) => {
    for (let char of item.chars) {
      allChars.add(char);
    }
  });
  return allChars;
}

function getLatinUnicodeRanges() {
  return [
    { name: "Latin-1 Supplement", start: 0x0080, end: 0x00ff },
    { name: "Latin Extended-A", start: 0x0100, end: 0x017f },
    { name: "Latin Extended-B", start: 0x0180, end: 0x024f },
    { name: "Latin Extended Additional", start: 0x1e00, end: 0x1eff },
    { name: "Latin Extended-C", start: 0x2c60, end: 0x2c7f },
    { name: "Latin Extended-D", start: 0xa720, end: 0xa7ff },
  ];
}

function isLetter(char) {
  return /\p{Letter}/u.test(char);
}

function analyzeRangeCoverage(range, coveredChars) {
  let total = 0;
  let covered = 0;
  let missing = [];

  for (let code = range.start; code <= range.end; code++) {
    const char = String.fromCharCode(code);
    if (isLetter(char)) {
      total++;
      if (coveredChars.has(char)) {
        covered++;
      } else {
        missing.push(
          `U+${code.toString(16).toUpperCase().padStart(4, "0")} (${char})`
        );
      }
    }
  }

  return { total, covered, missing };
}

function formatMissingCharacters(missing) {
  if (missing.length === 0) {
    return null;
  }

  if (missing.length <= 10) {
    return missing.join(", ");
  }

  return `${missing.slice(0, 5).join(", ")} ... and ${missing.length - 5} more`;
}

function displayRangeCoverage(range, analysis) {
  const percentage = Math.round((analysis.covered / analysis.total) * 100);
  console.log(`\n${range.name}: ${analysis.covered}/${analysis.total} (${percentage}%)`);

  const missingFormatted = formatMissingCharacters(analysis.missing);
  if (missingFormatted) {
    console.log("Missing:", missingFormatted);
  }
}

function checkCoverage() {
  const allChars = getAllCoveredCharacters(diacritics.replacementList);
  console.log("Total characters covered:", allChars.size);

  const latinRanges = getLatinUnicodeRanges();

  latinRanges.forEach((range) => {
    const analysis = analyzeRangeCoverage(range, allChars);
    displayRangeCoverage(range, analysis);
  });
}

checkCoverage();
