import fs from 'fs';

interface RawChinguData {
  Timestamp: string;
  Gender: string;
  'Country Code': string;
  Timezone: string;
  Goal: string;
  'Goal-Other': string | number;
  Source: string;
  'Source-Other': number | string;
  'Country name (from Country)': string;
  'Solo Project Tier': string;
  'Role Type': string;
  'Voyage Role': string;
  'Voyage (from Voyage Signups)': string;
  'Voyage Tier': string;
}

interface CleanedChinguData {
  timestamp: string | null; // keep as string for now; only normalizing empties
  gender: string | null;
  countryCode: string | null;
  timezone: string | null;
  goal: string | null;
  goalOther: string | null;
  source: string | null;
  sourceOther: string | null;
  countryName: string | null;
  soloProjectTier: string | null;
  roleType: string | null;
  voyageRole: string | null;
  voyage: string | null;
  voyageTier: string | null;
}

type IsoMaps = {
  codeToName: Record<string, string>;
  nameToCode: Record<string, string>;
};

function buildIsoMaps(): IsoMaps {
  const codeToName: Record<string, string> = {};
  const nameToCode: Record<string, string> = {};

  let regionNames: Intl.DisplayNames | null = null;
  try {
    // @ts-ignore
    regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  } catch {
    regionNames = null;
  }

  if (regionNames) {
    // Generate all A-Z pairs and keep only valid ISO regions
    const A = 'A'.charCodeAt(0);
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 26; j++) {
        const code = String.fromCharCode(A + i) + String.fromCharCode(A + j);
        const name = regionNames.of(code as any);
        if (typeof name === 'string') {
          codeToName[code] = name;
          nameToCode[name.toLowerCase()] = code;
        }
      }
    }
  }

  // Minimal fallback if Intl.DisplayNames not available
  if (Object.keys(codeToName).length === 0) {
    const fallback: Record<string, string> = {
      US: 'United States',
      GB: 'United Kingdom',
      CA: 'Canada',
      AU: 'Australia',
      DE: 'Germany',
      FR: 'France',
      IT: 'Italy',
      ES: 'Spain',
      NL: 'Netherlands',
      SE: 'Sweden',
      NO: 'Norway',
      DK: 'Denmark',
      FI: 'Finland',
      PL: 'Poland',
      BR: 'Brazil',
      MX: 'Mexico',
      IN: 'India',
      CN: 'China',
      JP: 'Japan',
      KR: 'South Korea',
      RU: 'Russia',
      ZA: 'South Africa',
    };
    for (const [code, name] of Object.entries(fallback)) {
      codeToName[code] = name;
      nameToCode[name.toLowerCase()] = code;
    }
  }

  return { codeToName, nameToCode };
}

const ALT_3_TO_2: Record<string, string> = {
  USA: 'US',
  GBR: 'GB',
  DEU: 'DE',
  FRA: 'FR',
  ITA: 'IT',
  ESP: 'ES',
  NLD: 'NL',
  SWE: 'SE',
  NOR: 'NO',
  DNK: 'DK',
  FIN: 'FI',
  POL: 'PL',
  RUS: 'RU',
  CHN: 'CN',
  JPN: 'JP',
  KOR: 'KR',
  BRA: 'BR',
  MEX: 'MX',
  CAN: 'CA',
  AUS: 'AU',
  NZL: 'NZ',
  IND: 'IN',
  IRN: 'IR',
  TUR: 'TR',
  EGY: 'EG',
  ZAF: 'ZA',
  ARE: 'AE',
  PAK: 'PK',
  BGD: 'BD',
  IDN: 'ID',
  VNM: 'VN',
  THA: 'TH',
  MYS: 'MY',
  PHL: 'PH',
  SGP: 'SG',
  HKG: 'HK',
  TWN: 'TW',
};

const ALT_NAME_TO_CODE: Record<string, string> = {
  // United States
  'usa': 'US',
  'u.s.a.': 'US',
  'u.s.': 'US',
  'us': 'US',
  'united states of america': 'US',
  'united states': 'US',
  // United Kingdom
  'uk': 'GB',
  'u.k.': 'GB',
  'great britain': 'GB',
  'britain': 'GB',
  'united kingdom': 'GB',
  // South Korea
  'south korea': 'KR',
  'korea, republic of': 'KR',
  'republic of korea': 'KR',
  'korea': 'KR',
  // Russia
  'russian federation': 'RU',
  'russia': 'RU',
  // Netherlands
  'the netherlands': 'NL',
  'netherlands': 'NL',
  // Ivory Coast
  "cote d'ivoire": 'CI',
  'côte d’ivoire': 'CI',
  'ivory coast': 'CI',
  // Czechia
  'czech republic': 'CZ',
  'czechia': 'CZ',
  // Myanmar
  'burma': 'MM',
  'myanmar': 'MM',
  // Others common
  'laos': 'LA',
  'viet nam': 'VN',
  'venezuela (bolivarian republic of)': 'VE',
  'moldova, republic of': 'MD',
  'iran, islamic republic of': 'IR',
  'syrian arab republic': 'SY',
  'tanzania, united republic of': 'TZ',
  'bolivia (plurinational state of)': 'BO',
};

function normalizeEmpty(value: unknown): string | null {
  if (value === '' || value === null || value === undefined) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }
  return String(value);
}

class DataCleaner {
  private iso: IsoMaps;
  private stats = {
    total: 0,
    inferredCodeFromName: 0,
    inferredNameFromCode: 0,
    correctedNameToCanonical: 0,
    normalized3LetterTo2: 0,
    invalidCodeNullified: 0,
    aliasNameResolved: 0,
  };

  constructor() {
    this.iso = buildIsoMaps();
  }

  private toUpper2Letters(code: string | null): string | null {
    if (!code) return null;
    let c = code.trim().toUpperCase();

    // Convert common 3-letter codes to 2-letter
    if (c.length === 3 && ALT_3_TO_2[c]) {
      c = ALT_3_TO_2[c];
      this.stats.normalized3LetterTo2++;
    }

    // Remove punctuation/spaces (e.g., "U.S." -> "US")
    c = c.replace(/[^A-Z]/g, '');

    if (/^[A-Z]{2}$/.test(c)) return c;
    return null;
  }

  private resolveNameToCode(name: string | null): { code: string | null; canonicalName: string | null; alias: boolean } {
    if (!name) return { code: null, canonicalName: null, alias: false };

    const raw = name.trim();
    const lower = raw.toLowerCase();

    // Try alias map first
    if (ALT_NAME_TO_CODE[lower]) {
      const code = ALT_NAME_TO_CODE[lower];
      const canonicalName = this.iso.codeToName[code] ?? raw; // prefer canonical name
      return { code, canonicalName, alias: true };
    }

    // Try direct match on canonical ISO name
    if (this.iso.nameToCode[lower]) {
      const code = this.iso.nameToCode[lower];
      const canonicalName = this.iso.codeToName[code] ?? raw;
      return { code, canonicalName, alias: false };
    }

    // Try removing punctuation/accents and re-check quickly
    const simplified = lower.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, "'");
    if (ALT_NAME_TO_CODE[simplified]) {
      const code = ALT_NAME_TO_CODE[simplified];
      const canonicalName = this.iso.codeToName[code] ?? raw;
      return { code, canonicalName, alias: true };
    }

    return { code: null, canonicalName: raw, alias: false };
  }

  private reconcileCountry(codeInput: string | null, nameInput: string | null): { code: string | null; name: string | null } {
    let code = this.toUpper2Letters(codeInput);
    let name = nameInput ? nameInput.trim() : null;

    // If name is a known alias or canonical ISO name, try resolve to code
    const nameRes = this.resolveNameToCode(name);

    // If both present but inconsistent, prefer ISO canonical pair using valid code if possible
    if (code && this.iso.codeToName[code]) {
      const canonical = this.iso.codeToName[code];
      if (!name || name.toLowerCase() !== canonical.toLowerCase()) {
        name = canonical;
        this.stats.correctedNameToCanonical++;
      }
    } else {
      // Code missing/invalid: try infer from name
      if (nameRes.code) {
        code = nameRes.code;
        name = this.iso.codeToName[code] ?? nameRes.canonicalName;
        this.stats.inferredCodeFromName++;
        if (nameRes.alias) this.stats.aliasNameResolved++;
      } else {
        // No valid code or resolvable name
        if (code && !this.iso.codeToName[code]) {
          this.stats.invalidCodeNullified++;
          code = null;
        }
      }
    }

    // If we now have a valid code but name is still null, fill it
    if (code && !name) {
      name = this.iso.codeToName[code] ?? null;
      if (name) this.stats.inferredNameFromCode++;
    }

    // Final sanity: ensure code and name agree
    if (code && name) {
      const canonical = this.iso.codeToName[code];
      if (canonical && canonical.toLowerCase() !== name.toLowerCase()) {
        name = canonical;
        this.stats.correctedNameToCanonical++;
      }
    }

    return { code, name };
  }

  public cleanRecord(raw: RawChinguData): CleanedChinguData {
    // Normalize empties everywhere (strings -> trimmed or null)
    const timestamp = normalizeEmpty(raw.Timestamp);
    const gender = normalizeEmpty(raw.Gender);
    const tz = normalizeEmpty(raw.Timezone);
    const goal = normalizeEmpty(raw.Goal);
    const goalOther = normalizeEmpty(raw['Goal-Other']);
    const source = normalizeEmpty(raw.Source);
    const sourceOther = normalizeEmpty(raw['Source-Other']);
    const soloProjectTier = normalizeEmpty(raw['Solo Project Tier']);
    const roleType = normalizeEmpty(raw['Role Type']);
    const voyageRole = normalizeEmpty(raw['Voyage Role']);
    const voyage = normalizeEmpty(raw['Voyage (from Voyage Signups)']);
    const voyageTier = normalizeEmpty(raw['Voyage Tier']);

    // Country-specific cleaning and reconciliation
    const countryCodeRaw = normalizeEmpty(raw['Country Code']);
    const countryNameRaw = normalizeEmpty(raw['Country name (from Country)']);
    const { code: countryCode, name: countryName } = this.reconcileCountry(
      countryCodeRaw,
      countryNameRaw
    );

    return {
      timestamp,
      gender,
      countryCode,
      timezone: tz,
      goal,
      goalOther,
      source,
      sourceOther,
      countryName,
      soloProjectTier,
      roleType,
      voyageRole,
      voyage,
      voyageTier,
    };
  }

  public getStats() {
    return this.stats;
  }
}

// Main execution
async function main() {
  const raw = fs.readFileSync(__dirname + '/data.json', 'utf8');
  const data = JSON.parse(raw);

  const cleaner = new DataCleaner();
  const cleanedData: CleanedChinguData[] = [];

  console.log(`Processing ${data.chingus.length} records...`);

  data.chingus.forEach((record: RawChinguData) => {
    const cleaned = cleaner.cleanRecord(record);
    cleanedData.push(cleaned);
  });

  // Save cleaned data
  fs.writeFileSync(
    __dirname + '/cleaned-data.json',
    JSON.stringify({ chingus: cleanedData }, null, 2)
  );

  const s = cleaner.getStats();
  console.log('\n=== COUNTRY CLEANING SUMMARY ===');
  console.log(`Total: ${data.chingus.length}`);
  console.log(`Inferred code from name: ${s.inferredCodeFromName}`);
  console.log(`Inferred name from code: ${s.inferredNameFromCode}`);
  console.log(`Corrected name to canonical: ${s.correctedNameToCanonical}`);
  console.log(`Alias names resolved: ${s.aliasNameResolved}`);
  console.log(`3-letter -> 2-letter normalized: ${s.normalized3LetterTo2}`);
  console.log(`Invalid codes nullified: ${s.invalidCodeNullified}`);

  console.log('\n✅ Cleaned data saved to cleaned-data.json');
}

main().catch(console.error);

// import fs from 'fs';

// interface RawChinguData {
//   Timestamp: string;
//   Gender: string;
//   'Country Code': string;
//   Timezone: string;
//   Goal: string;
//   'Goal-Other': string | number;
//   Source: string;
//   'Source-Other': number;
//   'Country name (from Country)': string;
//   'Solo Project Tier': string;
//   'Role Type': string;
//   'Voyage Role': string;
//   'Voyage (from Voyage Signups)': string;
//   'Voyage Tier': string;
// }

// interface CleanedChinguData {
//   timestamp: Date | null;
//   gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
//   countryCode: string | null;
//   timezone: string | null;
//   goal: string | null;
//   goalOther: string | null;
//   source: string | null;
//   sourceOther: string | null;
//   countryName: string | null;
//   soloProjectTier: string | null;
//   roleType: string | null;
//   voyageRole: string | null;
//   voyage: string | null;
//   voyageTier: string | null;
// }

// class DataCleaner {
//   private validGenders = ['MALE', 'FEMALE', 'OTHER'];
//   private validGoals = [
//     'ACCELERATE LEARNING',
//     'GAIN EXPERIENCE',
//     'NETWORK WITH SHARED GOALS',
//     'BUILD PORTFOLIO'
//   ];

//   // Normalize empty values
//   private normalizeEmpty(value: any): any {
//     if (value === '' || value === null || value === undefined) {
//       return null;
//     }
//     return value;
//   }

//   // Clean and validate timestamp
//   private cleanTimestamp(timestamp: string): Date | null {
//     if (!timestamp || timestamp === '') return null;
    
//     try {
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) return null;
      
//       // Validate reasonable date range (e.g., 2020-2026)
//       const year = date.getFullYear();
//       if (year < 2020 || year > 2026) return null;
      
//       return date;
//     } catch {
//       return null;
//     }
//   }

//   // Clean and validate gender
//   private cleanGender(gender: string): 'MALE' | 'FEMALE' | 'OTHER' | null {
//     if (!gender || gender === '') return null;
    
//     const normalized = gender.toUpperCase().trim();
//     if (this.validGenders.includes(normalized)) {
//       return normalized as 'MALE' | 'FEMALE' | 'OTHER';
//     }
    
//     return 'OTHER'; // Default for unrecognized values
//   }

//   // Clean country code (ISO 2-letter codes)
//   private cleanCountryCode(code: string): string | null {
//     if (!code || code === '') return null;
    
//     const cleaned = code.toUpperCase().trim();
//     // Validate 2-letter ISO code format
//     if (/^[A-Z]{2}$/.test(cleaned)) {
//       return cleaned;
//     }
    
//     return null;
//   }

//   // Clean timezone
//   private cleanTimezone(timezone: string): string | null {
//     if (!timezone || timezone === '') return null;
    
//     const cleaned = timezone.trim();
    
//     // Normalize common timezone formats
//     if (cleaned.startsWith('GMT')) {
//       // Handle both GMT−5 and GMT-5 formats
//       return cleaned.replace('−', '-');
//     }
    
//     return cleaned;
//   }

//   // Clean goal
//   private cleanGoal(goal: string): string | null {
//     if (!goal || goal === '') return null;
    
//     const normalized = goal.toUpperCase().trim();
    
//     // Check if it's a valid predefined goal
//     if (this.validGoals.includes(normalized)) {
//       return normalized;
//     }
    
//     return null;
//   }

//   // Clean Goal-Other (mixed types issue)
//   private cleanGoalOther(value: string | number): string | null {
//     if (value === null || value === undefined || value === '') return null;
    
//     // Convert to string and trim
//     const cleaned = String(value).trim();
    
//     if (cleaned === '' || cleaned === '0') return null;
    
//     return cleaned;
//   }

//   // Clean source
//   private cleanSource(source: string): string | null {
//     if (!source || source === '') return null;
//     return source.trim();
//   }

//   // Clean source-other (number field)
//   private cleanSourceOther(value: number): string | null {
//     if (value === null || value === undefined) return null;
    
//     const str = String(value).trim();
//     if (str === '' || str === '0') return null;
    
//     return str;
//   }

//   // Clean generic string field
//   private cleanString(value: string): string | null {
//     if (!value || value === '') return null;
//     return value.trim();
//   }

//   // Main cleaning function
//   public cleanRecord(raw: RawChinguData): CleanedChinguData {
//     return {
//       timestamp: this.cleanTimestamp(raw.Timestamp),
//       gender: this.cleanGender(raw.Gender),
//       countryCode: this.cleanCountryCode(raw['Country Code']),
//       timezone: this.cleanTimezone(raw.Timezone),
//       goal: this.cleanGoal(raw.Goal),
//       goalOther: this.cleanGoalOther(raw['Goal-Other']),
//       source: this.cleanSource(raw.Source),
//       sourceOther: this.cleanSourceOther(raw['Source-Other']),
//       countryName: this.cleanString(raw['Country name (from Country)']),
//       soloProjectTier: this.cleanString(raw['Solo Project Tier']),
//       roleType: this.cleanString(raw['Role Type']),
//       voyageRole: this.cleanString(raw['Voyage Role']),
//       voyage: this.cleanString(raw['Voyage (from Voyage Signups)']),
//       voyageTier: this.cleanString(raw['Voyage Tier'])
//     };
//   }
// }

// // Main execution
// async function main() {
//   const raw = fs.readFileSync(__dirname + '/data.json', 'utf8');
//   const data = JSON.parse(raw);
  
//   const cleaner = new DataCleaner();
//   const cleanedData: CleanedChinguData[] = [];
//   const errors: Array<{ index: number; record: any; error: string }> = [];
  
//   console.log(`Processing ${data.chingus.length} records...`);
  
//   data.chingus.forEach((record: RawChinguData, index: number) => {
//     try {
//       const cleaned = cleaner.cleanRecord(record);
//       cleanedData.push(cleaned);
//     } catch (error) {
//       errors.push({
//         index,
//         record,
//         error: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   });
  
//   // Generate report
//   console.log('\n=== CLEANING SUMMARY ===');
//   console.log(`Total records: ${data.chingus.length}`);
//   console.log(`Successfully cleaned: ${cleanedData.length}`);
//   console.log(`Errors: ${errors.length}`);
  
//   // Count nulls per field
//   const nullCounts: Record<string, number> = {};
//   Object.keys(cleanedData[0]).forEach(key => {
//     nullCounts[key] = cleanedData.filter(record => 
//       record[key as keyof CleanedChinguData] === null
//     ).length;
//   });
  
//   console.log('\n=== NULL COUNTS BY FIELD ===');
//   Object.entries(nullCounts).forEach(([field, count]) => {
//     const percentage = ((count / cleanedData.length) * 100).toFixed(2);
//     console.log(`${field}: ${count} (${percentage}%)`);
//   });
  
//   // Save cleaned data
//   fs.writeFileSync(
//     __dirname + '/cleaned-data.json',
//     JSON.stringify({ chingus: cleanedData }, null, 2)
//   );
  
//   // Save errors if any
//   if (errors.length > 0) {
//     fs.writeFileSync(
//       __dirname + '/cleaning-errors.json',
//       JSON.stringify(errors, null, 2)
//     );
//   }
  
//   console.log('\n✅ Cleaned data saved to cleaned-data.json');
//   if (errors.length > 0) {
//     console.log('⚠️  Errors saved to cleaning-errors.json');
//   }
// }

// main().catch(console.error);