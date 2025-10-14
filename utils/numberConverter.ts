import i18n from '@/i18n';

// Bengali numerals
const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

// Odia numerals
const odiaNumerals = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];

// Hindi numerals (Devanagari)
const hindiNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

// Assamese numerals (same as Bengali)
const assameseNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Convert English numerals to the appropriate language numerals based on current locale
 * @param number - The number to convert (can be number or string)
 * @returns The converted number as a string in the appropriate script
 */
export function convertToLocalizedNumber(number: number | string): string {
  const numStr = number.toString();
  const locale = i18n.locale || 'bn';

  let numerals: string[];
  
  switch (locale) {
    case 'or': // Odia
      numerals = odiaNumerals;
      break;
    case 'hi': // Hindi
      numerals = hindiNumerals;
      break;
    case 'as': // Assamese
      numerals = assameseNumerals;
      break;
    case 'bn': // Bengali
    default:
      numerals = bengaliNumerals;
      break;
  }

  // Convert each digit
  return numStr.replace(/\d/g, (digit) => numerals[parseInt(digit, 10)]);
}

/**
 * Convert localized numerals back to English numerals
 * @param localizedNumber - The localized number string
 * @returns The number in English numerals
 */
export function convertFromLocalizedNumber(localizedNumber: string): string {
  let result = localizedNumber;

  // Convert Bengali numerals
  bengaliNumerals.forEach((numeral, index) => {
    result = result.replace(new RegExp(numeral, 'g'), index.toString());
  });

  // Convert Odia numerals
  odiaNumerals.forEach((numeral, index) => {
    result = result.replace(new RegExp(numeral, 'g'), index.toString());
  });

  // Convert Hindi numerals
  hindiNumerals.forEach((numeral, index) => {
    result = result.replace(new RegExp(numeral, 'g'), index.toString());
  });

  return result;
}

