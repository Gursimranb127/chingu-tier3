import fs from 'fs';

async function main() {
  const raw = fs.readFileSync(__dirname + '/data.json', 'utf8');
  const data = JSON.parse(raw);

  const typeAnalysis = {};

  for (const chingu of data.chingus) {
    for (const [key, value] of Object.entries(chingu)) {
      if (!typeAnalysis[key]) {
        typeAnalysis[key] = new Set();
      }

      if (!typeAnalysis[key].has(typeof value)) {
        typeAnalysis[key].add(typeof value);
      }
    }
  }

  for (const [key, value] of Object.entries(typeAnalysis)) {
    console.log(key, value);
  }
}

main().catch((e) => console.error(e));
