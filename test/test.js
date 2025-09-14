var diacritics = require('../'),
    removeDiacritics = diacritics.remove,
    assert = require('assert');

// Test module exports
assert.strictEqual(typeof diacritics.remove, 'function', 'remove should be exported as a function');
assert.strictEqual(typeof diacritics.replacementList, 'object', 'replacementList should be exported');
assert.strictEqual(typeof diacritics.diacriticsMap, 'object', 'diacriticsMap should be exported');
assert.strictEqual(Array.isArray(diacritics.replacementList), true, 'replacementList should be an array');

// Original comprehensive tests
assert.strictEqual(removeDiacritics("Iлｔèｒｎåｔïｏｎɑｌíƶａｔï߀ԉ"),
    "Internationalizati0n");
assert.strictEqual(removeDiacritics("Båｃòл íｐѕùｍ ðｏɭ߀ｒ ѕïｔ ａϻèｔ âùþê ａԉᏧ߀üïｌɭê ƃëéｆ ｃｕｌρá ｆïｌèｔ ϻｉǥｎòｎ ｃｕρｉᏧａｔａｔ ｕｔ êлｉｍ ｔòлɢùê."),
    "Bacon ipѕum dhol0r ѕit aMet authe and0uille beef culpa filet Mignon cupidatat ut enim tonGue.");
assert.strictEqual(removeDiacritics("ᴎᴑᴅᴇȷʂ"), "NoDEJs");

assert.strictEqual(removeDiacritics("hambúrguer"), "hamburguer");
assert.strictEqual(removeDiacritics("hŒllœ"), "hOElloe");
assert.strictEqual(removeDiacritics("Fußball"), "Fussball");

assert.strictEqual(removeDiacritics("ABCDEFGHIJKLMNOPQRSTUVWXYZé"), "ABCDEFGHIJKLMNOPQRSTUVWXYZe");

// Edge cases
assert.strictEqual(removeDiacritics(""), "", "Empty string should return empty string");
assert.strictEqual(removeDiacritics("Hello World"), "Hello World", "ASCII-only string should remain unchanged");
assert.strictEqual(removeDiacritics("123456789"), "123456789", "Numbers should remain unchanged");
assert.strictEqual(removeDiacritics("!@#$%^&*()"), "!@#$%^&*()", "Special characters should remain unchanged");

// Mixed content tests (important for optimization validation)
assert.strictEqual(removeDiacritics("café"), "cafe", "Simple accented word");
assert.strictEqual(removeDiacritics("résumé"), "resume", "Multiple accents in one word");
assert.strictEqual(removeDiacritics("naïve"), "naive", "Diaeresis/umlaut");
assert.strictEqual(removeDiacritics("piñata"), "pinata", "Tilde");

// Unicode range edge cases
assert.strictEqual(removeDiacritics("Ÿ"), "Y", "Latin-1 Supplement range");
assert.strictEqual(removeDiacritics("Ā"), "A", "Latin Extended-A range");
assert.strictEqual(removeDiacritics("ƀ"), "b", "Latin Extended-B range");

// Test ASCII preservation (optimization benefit verification)
assert.strictEqual(removeDiacritics("The quick brown fox jumps over the lazy dog"),
    "The quick brown fox jumps over the lazy dog", "Long ASCII string should be unchanged");

// Mixed ASCII and diacritics (common real-world scenario)
assert.strictEqual(removeDiacritics("José lives in São Paulo"), "Jose lives in Sao Paulo");
assert.strictEqual(removeDiacritics("François went to Zürich"), "Francois went to Zurich");

// Test whitespace and formatting preservation
assert.strictEqual(removeDiacritics("  café  "), "  cafe  ", "Leading/trailing spaces preserved");
assert.strictEqual(removeDiacritics("line1\nliné2"), "line1\nline2", "Newlines preserved");
assert.strictEqual(removeDiacritics("tab\taccént"), "tab\taccent", "Tabs preserved");

// Test diacriticsMap consistency
var testChar = "é";
var expectedBase = "e";
assert.strictEqual(diacritics.diacriticsMap[testChar], expectedBase, "diacriticsMap should contain mapping for é");
assert.strictEqual(removeDiacritics(testChar), expectedBase, "removeDiacritics should use diacriticsMap");

// Verify replacementList structure
assert.strictEqual(diacritics.replacementList.length > 0, true, "replacementList should not be empty");
diacritics.replacementList.forEach(function(item, index) {
    assert.strictEqual(typeof item.base, 'string', 'replacementList[' + index + '].base should be string');
    assert.strictEqual(typeof item.chars, 'string', 'replacementList[' + index + '].chars should be string');
    assert.strictEqual(item.chars.length > 0, true, 'replacementList[' + index + '].chars should not be empty');
});

console.log("All tests passed! ✅");
