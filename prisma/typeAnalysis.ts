// import { chinguService } from '../src/features/chingu/chingu.service';

// const main = async () => {
//   const countries = await chinguService.getCountsByCountry();

//   const codes = countries.map((country) => country.countryCode);

//   const dict = await codes.reduce((acc, cur) => {
//     if (acc[cur]) {
//       acc[cur] += 1;
//     } else {
//       acc[cur] = 1;
//     }
//     return acc;
//   }, {});

//   console.table(dict);
// };

// main();

// import fs from 'fs';

// interface TypeInfo {
//   types: Set<string>;
//   anomalies: Array<{ index: number; key: string; value: any; reason: string }>;
//   nullCount: number;
//   emptyCount: number;
//   totalCount: number;
//   samples: any[];
// }

// interface AnalysisResult {
//   [key: string]: TypeInfo;
// }

// async function main() {
//   const raw = fs.readFileSync(__dirname + '/data.json', 'utf8');
//   const data = JSON.parse(raw);

//   const typeAnalysis: AnalysisResult = {};

//   for (const i in data.chingus) {
//     const record = data.chingus[i];

//     for (const [key, value] of Object.entries(record)) {
//       if (!typeAnalysis[key]) {
//         typeAnalysis[key] = {
//           types: new Set(),
//           anomalies: [],
//           nullCount: 0,
//           emptyCount: 0,
//           totalCount: 0,
//           samples: []
//         };
//       }

//       const analysis = typeAnalysis[key];
//       analysis.totalCount++;
//       analysis.types.add(typeof value);

//       // Collect sample values (up to 5)
//       if (analysis.samples.length < 5 && value !== null && value !== '') {
//         analysis.samples.push(value);
//       }

//       // Check for null/undefined
//       if (value === null || value === undefined) {
//         analysis.nullCount++;
//         analysis.anomalies.push({
//           index: parseInt(i),
//           key,
//           value,
//           reason: 'null/undefined value'
//         });
//       }

//       // Check for empty strings
//       if (value === '') {
//         analysis.emptyCount++;
//         analysis.anomalies.push({
//           index: parseInt(i),
//           key,
//           value,
//           reason: 'empty string'
//         });
//       }

//       // Check for zero (if numeric field)
//       if (value === 0 && typeof value === 'number') {
//         analysis.anomalies.push({
//           index: parseInt(i),
//           key,
//           value,
//           reason: 'zero value'
//         });
//       }

//       // Check for type inconsistencies
//       if (analysis.types.size > 1) {
//         analysis.anomalies.push({
//           index: parseInt(i),
//           key,
//           value,
//           reason: `type inconsistency: ${typeof value}`
//         });
//       }
//     }
//   }

//   // Print summary
//   console.log('\n=== DATA ANALYSIS SUMMARY ===\n');

//   for (const [key, info] of Object.entries(typeAnalysis)) {
//     console.log(`Field: ${key}`);
//     console.log(`  Types: ${Array.from(info.types).join(', ')}`);
//     console.log(`  Total records: ${info.totalCount}`);
//     console.log(`  Null/undefined: ${info.nullCount}`);
//     console.log(`  Empty strings: ${info.emptyCount}`);
//     console.log(`  Anomalies: ${info.anomalies.length}`);
//     console.log(`  Sample values:`, info.samples.slice(0, 3));

//     if (info.anomalies.length > 0) {
//       console.log(`  First 5 anomalies:`, info.anomalies.slice(0, 5));
//     }
//     console.log('---\n');
//   }

//   // Write detailed report to file
//   const report = JSON.stringify(
//     typeAnalysis,
//     (key, value) => value instanceof Set ? Array.from(value) : value,
//     2
//   );
//   fs.writeFileSync(__dirname + '/analysis-report.json', report);
//   console.log('Detailed report written to analysis-report.json');
// }

// main().catch((e) => console.error(e));

// import fs from 'fs';

// async function main() {
//   const raw = fs.readFileSync(__dirname + '/data.json', 'utf8');
//   const data = JSON.parse(raw);

//   const typeAnalysis = {};

//   for (const i in data.chingus) {
//     for (const [key, value] of Object.entries(data.chingus[i])) {
//       if (!typeAnalysis[key]) {
//         typeAnalysis[key] = {};
//       }

//       if (!Object.hasOwn(typeAnalysis[key], 'types')) {
//         typeAnalysis[key].types = new Set();
//       }

//       typeAnalysis[key].types.add(typeof value);

//       if (!Object.hasOwn(typeAnalysis[key], 'anomolies')) {
//         typeAnalysis[key].anomolies = [];
//       }

//       if (['', 0].includes(value)) {
//         typeAnalysis[key].anomolies.push({ key, value });
//       }
//     }
//   }

//   for (const [key, value] of Object.entries(typeAnalysis)) {
//     console.log(key, value);
//   }
// }

// main().catch((e) => console.error(e));
