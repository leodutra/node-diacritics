const { remove } = require('./index.js');


const logHeader = (title, newLine = false) => {
  logSeparator(newLine);
  console.log(title);
  logSeparator();
}

const logSeparator = (newLine = false) => {
  console.log(
    (newLine ? '\n' : '') + '='.repeat(70)
  )
};

const WARMUP_ITERATIONS = 1000;

function nanoToMilli(nano) {
  return Number(nano) / 1_000_000;
}

function warmupFunction(fn, iterations = WARMUP_ITERATIONS) {
  for (let i = 0; i < iterations; i++) {
    fn();
  }
}

function measurePerformance(fn, iterations) {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = process.hrtime.bigint();
  return nanoToMilli(end - start);
}

function calculateMetrics(totalTime, iterations) {
  const avgTime = totalTime / iterations;
  const opsPerSecond = Math.round(1000 / avgTime);
  return { totalTime, avgTime, opsPerSecond };
}

function displayResults({ totalTime, avgTime, opsPerSecond }) {
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per operation: ${avgTime.toFixed(6)}ms`);
  console.log(`Operations per second: ${opsPerSecond.toLocaleString()}`);
}

function benchmark(name, fn, iterations = 50000) {
  logHeader(name, true);

  warmupFunction(fn);
  const totalTime = measurePerformance(fn, iterations);
  const metrics = calculateMetrics(totalTime, iterations);

  displayResults(metrics);
  return metrics;
}

const createLongParagraph = () => `
  Łorem ipsum dolor sit amet, cōnsectetuer adipīscing elit.
  Maecenās porttitor congue massa. Fusce posuere, magna sed
  pulvinar ultricies, purus lectus malesuada libero, sit amet
  commodo magna eros quis urna. Nunc viverra imperdiet enim.
  Fusce est. Vivamus a tellus. Pellentesque habitant morbi
  tristique senectus et netus et malesuada fames ac turpis
  egestas. Proin pharetra nonummy pede. Mauris et orci.
  Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.
`.replace(/\s+/g, ' ').trim();

const createVeryLongText = () => `
  Ñoñó, eñ el año mil ñovecieñtos ñoveñta y ñueve, eñ el pueblo
  de Añañuca, vivía uña ñiña llamada Begoña. Begoña teñía uñ
  sueño: coñvertirse eñ la mejor diseñadora de España. Cada
  mañaña se levaña tempraño y se poñía a dibujar coñ mucho
  empeño. Su papá, doñ Toño, y su mamá, doña Coñcepció, la
  apoyadaƅ eñ todo. Uñ día, mieñtras camińaba por el señdero
  del cañó, eñcoñtró uñas piedras muy extrañas coñ símƅolos
  aǹtiguos grabados. Estas piedras teńíaň poderes mágicos que
  podíaň hacer realidad cualquier sueño. Begoña tomó las piedras
  y pidió su deseo coñ mucha fe. Al día siguieñte, recibió uña
  carta de uña uñiversidad prestigiosa de París que la iñvitaba
  a estudiar diseño. Así fue como Begoña cumplió su sueño gracias
  a su dedicació y a la magia de aqellas piedras eñcañtadas.
`.repeat(10).replace(/\s+/g, ' ').trim();

const shortStrings = {
  simple: "café",
  basicAccents: "résumé naïve"
};

const mediumStrings = {
  sentence: "The quick brown fox jumps over the lazy dog with café and résumé",
  international: "Iлｔèｒｎåｔïｏｎɑｌíƶａｔï߀ԉ",
  mixed: "Zürich München Köln François José María"
};

const longStrings = {
  paragraph: createLongParagraph(),
  longText: createVeryLongText()
};

const edgeCases = {
  empty: "",
  noAccents: "Hello World 123",
  onlyAccents: "àáâãäåæçèéêëìíîïñòóôõöøùúûüý",
  numbers: "123 456 789",
  specialChars: "!@#$%^&*()_+-=[]{}|;':\",./<>?"
};

const unicodeEdgeCases = {
  emoji: "Hello 👋 world 🌍 with café ☕",
  mixedScript: "Hello мир café 世界 السلام עולם"
};

const realWorldExamples = {
  names: "José María García-González François Müller Søren Østergård",
  cities: "São Paulo München Zürich Kraków Москва",
  words: "naïve résumé fiancé café piñata jalapeño"
};

const testData = {
  ...shortStrings,
  ...mediumStrings,
  ...longStrings,
  ...edgeCases,
  ...unicodeEdgeCases,
  ...realWorldExamples
};

const DENSITY_TEST_ITERATIONS = 75000;
const MEMORY_TEST_ITERATIONS = 10000;
const TOP_PERFORMERS_COUNT = 5;
const SAMPLE_KEYS = ['simple', 'international', 'mixed', 'cities'];
const MAX_DISPLAY_LENGTH = 50;
const TRUNCATE_LENGTH = 47;

const densityTests = {
  '0% accents': 'Hello World Test String',
  '25% accents': 'Héllo Wórld Tést Stríng',
  '50% accents': 'Héllö Wórld Tést Strïng',
  '75% accents': 'Héllö Wörlđ Tést Strïñg',
  '100% accents': 'Héllö Wörlđ Tést Strïñğ'
};

function runMainBenchmarks() {
  const results = [];
  Object.entries(testData).forEach(([name, text]) => {
    const description = `${name} (${text.length} chars)`;
    const result = benchmark(description, () => remove(text));
    results.push({ name, length: text.length, ...result });
  });
  return results;
}

function runDensityBenchmarks() {
  Object.entries(densityTests).forEach(([density, text]) => {
    benchmark(density, () => remove(text), DENSITY_TEST_ITERATIONS);
  });
}

function runMemoryTest() {
  const memBefore = process.memoryUsage();
  for (let i = 0; i < MEMORY_TEST_ITERATIONS; i++) {
    remove(testData.longText);
  }
  const memAfter = process.memoryUsage();
  return { memBefore, memAfter };
}

function displayMemoryUsage({ memBefore, memAfter }) {
  const rssDiff = (memAfter.rss - memBefore.rss) / 1024 / 1024;
  const heapDiff = (memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024;
  console.log(`RSS: ${rssDiff.toFixed(2)} MB`);
  console.log(`Heap Used: ${heapDiff.toFixed(2)} MB`);
}

function getTopPerformers(results) {
  return results.sort((a, b) => b.opsPerSecond - a.opsPerSecond);
}

function displayTopPerformers(sortedResults) {
  console.log('\nTop performers by ops/second:');
  sortedResults.slice(0, TOP_PERFORMERS_COUNT).forEach((result, i) => {
    console.log(`${i + 1}. ${result.name}: ${result.opsPerSecond.toLocaleString()} ops/sec`);
  });
}

function truncateText(text, maxLength = MAX_DISPLAY_LENGTH, truncateAt = TRUNCATE_LENGTH) {
  return text.length > maxLength ? text.substring(0, truncateAt) + '...' : text;
}

function displaySampleOutputs() {
  console.log('\nSample outputs:');
  SAMPLE_KEYS.forEach(key => {
    if (testData[key]) {
      const input = truncateText(testData[key]);
      const output = remove(testData[key]);
      const outputDisplay = truncateText(output);
      console.log(`${key}: "${input}" → "${outputDisplay}"`);
    }
  });
}

function getTotalMappableCharacters() {
  const { replacementList } = require('./index.js');
  return replacementList.reduce((sum, item) => sum + item.chars.length, 0);
}

function displayCharacterInfo() {
  const totalChars = getTotalMappableCharacters();
  console.log(`Total mappable characters: ${totalChars}`);
}

function runBenchmarkSuite() {
  logHeader('DIACRITICS REMOVAL BENCHMARK');
  const results = runMainBenchmarks();

  logHeader('PERFORMANCE BY ACCENT DENSITY', true);
  runDensityBenchmarks();

  logHeader('MEMORY USAGE TEST', true);
  const memoryResults = runMemoryTest();
  displayMemoryUsage(memoryResults);

  logHeader('PERFORMANCE SUMMARY', true);
  displayCharacterInfo();
  const sortedResults = getTopPerformers(results);
  displayTopPerformers(sortedResults);
  displaySampleOutputs();

  logHeader('BENCHMARK COMPLETE', true);
}

runBenchmarkSuite();
