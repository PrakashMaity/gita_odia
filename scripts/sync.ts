import fs from 'fs';
import path from 'path';
import translate from 'translate';
import { fileURLToPath } from 'url';

// Configure translation engine
translate.engine = 'google';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TRANSLATIONS_DIR = path.join(__dirname, '../src/lib/i18n/translations');
const SOURCE_LANG = 'bn';
const TARGET_LANGS = ['as', 'en', 'gu', 'hi', 'ne', 'or'];

// Language mapping for the translate package
const LANG_MAP: Record<string, string> = {
    bn: 'bn', // Bengali
    as: 'as', // Assamese
    en: 'en', // English
    gu: 'gu', // Gujarati
    hi: 'hi', // Hindi
    ne: 'ne', // Nepali
    or: 'or', // Odia
};

/**
 * Load a JSON file and return its content
 */
function loadJson(filePath: string): any {
    if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.error(`Error parsing JSON in ${filePath}`);
            return {};
        }
    }
    return {};
}

/**
 * Save an object as a formatted JSON file
 */
function saveJson(filePath: string, data: any) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`Saved ${path.basename(filePath)}`);
}

/**
 * Deep merge source into target and track missing keys
 * Returns a tuple of [updatedTarget, missingPaths]
 */
function findMissingAndMerge(source: any, target: any, currentPath = ''): [any, string[]] {
    const result: any = { ...target };
    const missingPaths: string[] = [];

    for (const key of Object.keys(source)) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;

        // Check if property is missing or is an empty string
        if (result[key] === undefined || result[key] === '') {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                // It's a nested object entirely missing
                result[key] = {};
                const [nestedResult, nestedMissing] = findMissingAndMerge(source[key], result[key], newPath);
                result[key] = nestedResult;
                missingPaths.push(...nestedMissing);
            } else if (Array.isArray(source[key])) {
                // For simplicity, we just copy arrays over and tag them for translation 
                // (usually array contents need translation per item, but we'll collect the path)
                result[key] = [...source[key]];
                missingPaths.push(newPath);
            } else {
                // It's a primitive missing value
                result[key] = source[key];
                missingPaths.push(newPath);
            }
        } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            // Both have the object, deep search
            const [nestedResult, nestedMissing] = findMissingAndMerge(source[key], result[key], newPath);
            result[key] = nestedResult;
            missingPaths.push(...nestedMissing);
        }
    }

    return [result, missingPaths];
}

/**
 * Get value from an object using dot notation path
 */
function getPathValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

/**
 * Set value in an object using dot notation path
 */
function setPathValue(obj: any, path: string, value: any) {
    const parts = path.split('.');
    const lastPart = parts.pop()!;
    let current = obj;

    for (const part of parts) {
        if (current[part] === undefined) {
            current[part] = {};
        }
        current = current[part];
    }

    current[lastPart] = value;
}

/**
 * Main translation function
 */
async function syncTranslations() {
    console.log(`🏁 Starting translation sync from ${SOURCE_LANG}`);

    const sourceFile = path.join(TRANSLATIONS_DIR, `${SOURCE_LANG}.json`);
    const sourceData = loadJson(sourceFile);

    if (Object.keys(sourceData).length === 0) {
        console.error(`❌ Source file ${sourceFile} is empty or missing!`);
        process.exit(1);
    }

    for (const lang of TARGET_LANGS) {
        console.log(`\n⏳ Checking translations for target: [${lang}]...`);

        const targetFile = path.join(TRANSLATIONS_DIR, `${lang}.json`);
        const targetData = loadJson(targetFile);

        const [updatedTarget, missingPaths] = findMissingAndMerge(sourceData, targetData);

        if (missingPaths.length === 0) {
            console.log(`✅ [${lang}] is completely up-to-date. Skipping.`);
            // We still save to ensure formatting is correct and any removed keys from source are synced? 
            // Actually strictly additive, we don't prune old keys here to be safe.
            saveJson(targetFile, updatedTarget);
            continue;
        }

        console.log(`📋 Found ${missingPaths.length} missing translation paths for [${lang}]`);

        // Batch process missing keys to avoid overwhelming the API
        const targetLangCode = LANG_MAP[lang];

        // Process items in parallel batches 
        let translatedCount = 0;

        // Run up to 10 translations concurrently to speed it up without hitting instant rate limits
        const BATCH_SIZE = 10;

        for (let i = 0; i < missingPaths.length; i += BATCH_SIZE) {
            const batch = missingPaths.slice(i, i + BATCH_SIZE);

            await Promise.all(batch.map(async (p) => {
                const sourceVal = getPathValue(sourceData, p);

                try {
                    if (Array.isArray(sourceVal)) {
                        const translatedArr = [];
                        for (const item of sourceVal) {
                            if (typeof item === 'string') {
                                const translated = await translate(item, { from: SOURCE_LANG, to: targetLangCode });
                                translatedArr.push(translated);
                            } else {
                                translatedArr.push(item);
                            }
                        }
                        setPathValue(updatedTarget, p, translatedArr);
                        translatedCount++;
                    } else if (typeof sourceVal === 'string') {
                        const translated = await translate(sourceVal, { from: SOURCE_LANG, to: targetLangCode });
                        setPathValue(updatedTarget, p, translated);
                        translatedCount++;
                    }
                } catch (error) {
                    console.error(`❌ Failed to translate path '${p}' for [${lang}]:`, error);
                }
            }));

            console.log(`   Progress: translated ${translatedCount}/${missingPaths.length} items for [${lang}]...`);
            // Small delay between batches
            await new Promise(r => setTimeout(r, 200));
        }

        console.log(`🎉 Finished translating ${translatedCount} items for [${lang}]. Saving...`);
        saveJson(targetFile, updatedTarget);
    }

    console.log('\n✅ Translation sync completed successfully!');
}

// Run the script
syncTranslations().catch(e => {
    console.error('Fatal error running sync:', e);
});
