/**
 * ============================================================
 *  🚀 New Language Client Setup Script
 * ============================================================
 *
 *  Usage:  npm run new-client
 *          npx tsx scripts/new-client.ts
 *
 *  This script automates the entire process of adding a new
 *  language client to the Gita app. It:
 *
 *   1. Prompts for language code, app name, font, direction
 *   2. Creates .env files (dev + prod)
 *   3. Creates asset directories
 *   4. Clones branding images from bn/ (replaceable later)
 *   5. Translates all 18 chapter JSONs from English
 *   6. Translates UI strings (en.json → <lang>.json)
 *   7. Patches Data/index.ts, i18n/index.ts, clientConfig.ts,
 *      eas.json, and package.json
 *
 *  Requires: `translate` package (already in devDependencies)
 * ============================================================
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import translate from 'translate';

// ─── Configure Google Translate ──────────────────────────────

translate.engine = 'google';

// ─── Paths ───────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const PATHS = {
    envExample: path.join(ROOT, '.env.example'),
    envBnDev: path.join(ROOT, '.env.bn.development'),
    assetsImages: path.join(ROOT, 'assets/images'),
    assetsFonts: path.join(ROOT, 'assets/fonts'),
    assetsData: path.join(ROOT, 'assets/Data'),
    dataIndex: path.join(ROOT, 'assets/Data/index.ts'),
    i18nDir: path.join(ROOT, 'src/lib/i18n/translations'),
    i18nIndex: path.join(ROOT, 'src/lib/i18n/index.ts'),
    clientConfig: path.join(ROOT, 'src/config/clientConfig.ts'),
    easJson: path.join(ROOT, 'eas.json'),
    packageJson: path.join(ROOT, 'package.json'),
    googleServices: path.join(ROOT, 'google-services.json'),
};

// ─── Font Suggestions ────────────────────────────────────────

const FONT_SUGGESTIONS: Record<string, string> = {
    hi: 'NotoSerifDevanagari',
    mr: 'NotoSerifDevanagari',
    ne: 'NotoSerifDevanagari',
    sa: 'NotoSerifDevanagari',
    bn: 'NotoSerifBengali',
    as: 'NotoSerifBengali',
    gu: 'NotoSerifGujarati',
    ta: 'NotoSerifTamil',
    te: 'NotoSerifTelugu',
    kn: 'NotoSerifKannada',
    ml: 'NotoSerifMalayalam',
    pa: 'NotoSerifGurmukhi',
    or: 'NotoSerifOriya',
    si: 'NotoSerifSinhala',
    en: 'NotoSerif',
    ur: 'NotoNastaliqUrdu',
};

// ─── Language Names (for metadata translation) ───────────────

const LANG_NAMES: Record<string, string> = {
    hi: 'हिंदी', mr: 'मराठी', ne: 'नेपाली', sa: 'संस्कृतम्',
    bn: 'বাংলা', as: 'অসমীয়া', gu: 'ગુજરાતી', ta: 'தமிழ்',
    te: 'తెలుగు', kn: 'ಕನ್ನಡ', ml: 'മലയാളം', pa: 'ਪੰਜਾਬੀ',
    or: 'ଓଡ଼ିଆ', si: 'සිංහල', en: 'English', ur: 'اردو',
};

// ─── Readline Helper ─────────────────────────────────────────

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question: string, defaultValue?: string): Promise<string> {
    const suffix = defaultValue ? ` [${defaultValue}]` : '';
    return new Promise((resolve) => {
        rl.question(`  ${question}${suffix}: `, (answer) => {
            resolve(answer.trim() || defaultValue || '');
        });
    });
}

// ─── Translation Helpers ─────────────────────────────────────

const BATCH_SIZE = 8;
const BATCH_DELAY_MS = 300;

async function translateText(text: string, toLang: string): Promise<string> {
    if (!text || text.trim() === '') return text;
    try {
        const result = await translate(text, { from: 'en', to: toLang });
        return result;
    } catch (err) {
        console.warn(`    ⚠️  Translation failed for: "${text.substring(0, 40)}..." — keeping original`);
        return text;
    }
}

async function translateBatch(items: string[], toLang: string): Promise<string[]> {
    const results: string[] = [];
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        const translated = await Promise.all(
            batch.map((t) => translateText(t, toLang))
        );
        results.push(...translated);
        if (i + BATCH_SIZE < items.length) {
            await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
        }
    }
    return results;
}

/**
 * Deep-translate all string values in a JSON object.
 * Used for UI translation files.
 */
async function deepTranslate(obj: any, toLang: string, currentPath = ''): Promise<any> {
    if (typeof obj === 'string') {
        return translateText(obj, toLang);
    }
    if (Array.isArray(obj)) {
        const results: any[] = [];
        for (const item of obj) {
            results.push(await deepTranslate(item, toLang, currentPath));
        }
        return results;
    }
    if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const newPath = currentPath ? `${currentPath}.${key}` : key;
            result[key] = await deepTranslate(obj[key], toLang, newPath);

            // Progress indicator every 50 keys at top level
            if (!currentPath && i > 0 && i % 50 === 0) {
                process.stdout.write(`    📝 UI strings: ${i}/${keys.length} sections...\r`);
            }
        }
        return result;
    }
    return obj;
}

// ─── File Helpers ────────────────────────────────────────────

function readJson(filePath: string): any {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath: string, data: any) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function readText(filePath: string): string {
    return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath: string, content: string) {
    fs.writeFileSync(filePath, content, 'utf8');
}

function ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// ─── Step 1: Collect User Input ──────────────────────────────

interface ClientInput {
    lang: string;
    appName: string;
    fontFamily: string;
    scriptDirection: 'ltr' | 'rtl';
    packageSuffix: string;
}

async function collectInput(): Promise<ClientInput> {
    console.log('\n🚀 New Language Client Setup\n');
    console.log('  This script will create all necessary files for a new language.\n');

    const lang = await ask('Language code (e.g., ta, ml, te, pa)');
    if (!lang || lang.length < 2 || lang.length > 3) {
        console.error('❌ Invalid language code. Must be 2-3 characters.');
        process.exit(1);
    }

    // Check if already exists
    if (fs.existsSync(path.join(PATHS.assetsData, lang))) {
        const overwrite = await ask(`⚠️  Language "${lang}" already exists. Overwrite? (y/N)`, 'N');
        if (overwrite.toLowerCase() !== 'y') {
            console.log('Aborted.');
            process.exit(0);
        }
    }

    const appName = await ask('App name in target language (e.g., கீதை தமிழ்)');
    if (!appName) {
        console.error('❌ App name is required.');
        process.exit(1);
    }

    const suggestedFont = FONT_SUGGESTIONS[lang] || 'NotoSerif';
    const fontFamily = await ask(`Font family`, suggestedFont);

    const dirInput = await ask('Script direction (ltr/rtl)', 'ltr');
    const scriptDirection = dirInput === 'rtl' ? 'rtl' : 'ltr';

    const defaultSuffix = `bhagavad_gita_${lang}`;
    const packageSuffix = await ask('Android package suffix', defaultSuffix);

    console.log('\n  ────────────────────────────────');
    console.log(`  Language:    ${lang}`);
    console.log(`  App Name:    ${appName}`);
    console.log(`  Font:        ${fontFamily}`);
    console.log(`  Direction:   ${scriptDirection}`);
    console.log(`  Package:     com.proninja.${packageSuffix}`);
    console.log('  ────────────────────────────────\n');

    const confirm = await ask('Proceed? (Y/n)', 'Y');
    if (confirm.toLowerCase() === 'n') {
        console.log('Aborted.');
        process.exit(0);
    }

    return { lang, appName, fontFamily, scriptDirection, packageSuffix };
}

// ─── Step 2: Create Environment Files ────────────────────────

/**
 * Parse a .env file and return key-value pairs.
 */
function parseEnvFile(filePath: string): Record<string, string> {
    const result: Record<string, string> = {};
    if (!fs.existsSync(filePath)) return result;
    const lines = readText(filePath).split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        result[key] = value;
    }
    return result;
}

function createEnvFiles(input: ClientInput) {
    console.log('\n📄 Creating environment files...');

    // Read shared keys from bn development env
    const bnEnv = parseEnvFile(PATHS.envBnDev);
    const supabaseUrl = bnEnv['SUPABASE_URL'] || 'https://your-project.supabase.co';
    const supabaseKey = bnEnv['SUPABASE_ANON_KEY'] || 'your-anon-key';
    const rcAndroid = bnEnv['REVENUECAT_ANDROID_API_KEY'] || 'your-android-key';
    const rcIos = bnEnv['REVENUECAT_IOS_API_KEY'] || 'your-ios-key';

    console.log('  📋 Reusing Supabase & RevenueCat keys from bn client');

    const envContent = () => `# Client Identity
APP_LANG=${input.lang}
APP_NAME=${input.appName}
APP_SLUG=bhagavad_gita_${input.lang}
APP_PACKAGE=com.proninja.${input.packageSuffix}
APP_BUNDLE_ID=com.proninja.${input.packageSuffix.replace(/_/g, '-')}

# AdMob — replace with real IDs from AdMob console
ADMOB_ANDROID_APP_ID=ca-app-pub-3940256099942544~3347511713
ADMOB_IOS_APP_ID=ca-app-pub-3940256099942544~1458002511
BANNER_AD_UNIT_ID=ca-app-pub-3940256099942544/6300978111
INTERSTITIAL_AD_UNIT_ID=ca-app-pub-3940256099942544/1033173712
REWARDED_AD_UNIT_ID=ca-app-pub-3940256099942544/5224354917
REWARDED_INTERSTITIAL_AD_UNIT_ID=ca-app-pub-3940256099942544/5354046379
APP_OPEN_AD_UNIT_ID=ca-app-pub-3940256099942544/9257395921

# Supabase (shared across clients)
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseKey}

# RevenueCat (shared across clients)
REVENUECAT_ANDROID_API_KEY=${rcAndroid}
REVENUECAT_IOS_API_KEY=${rcIos}

# EAS — run 'eas init' to get project ID
EAS_PROJECT_ID=your-eas-project-id
`;

    const devPath = path.join(ROOT, `.env.${input.lang}.development`);
    const prodPath = path.join(ROOT, `.env.${input.lang}.production`);

    writeText(devPath, envContent());
    writeText(prodPath, envContent());

    console.log(`  ✅ Created ${path.basename(devPath)}`);
    console.log(`  ✅ Created ${path.basename(prodPath)}`);
}

// ─── Step 3: Create Asset Directories & Clone Images ─────────

function createAssetDirs(input: ClientInput) {
    console.log('\n📁 Creating asset directories & cloning images...');

    const imagesDir = path.join(PATHS.assetsImages, input.lang);
    const dataDir = path.join(PATHS.assetsData, input.lang);
    const bnImagesDir = path.join(PATHS.assetsImages, 'bn');

    ensureDir(imagesDir);
    ensureDir(dataDir);

    // Clone all image files from bn/ so prebuild works immediately
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
    let clonedCount = 0;

    if (fs.existsSync(bnImagesDir)) {
        const files = fs.readdirSync(bnImagesDir);
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (imageExtensions.includes(ext)) {
                const srcPath = path.join(bnImagesDir, file);
                const destPath = path.join(imagesDir, file);
                fs.copyFileSync(srcPath, destPath);
                clonedCount++;
            }
        }
        console.log(`  ✅ Cloned ${clonedCount} images from bn/ → ${input.lang}/`);
    } else {
        console.log('  ⚠️  No bn/ images directory found. Creating empty folder.');
    }

    console.log(`  ✅ Created assets/images/${input.lang}/`);
    console.log(`  ✅ Created assets/Data/${input.lang}/`);

    // ── Clone font files ──
    const bnFontsDir = path.join(PATHS.assetsFonts, 'bn');
    const targetFontsDir = path.join(PATHS.assetsFonts, input.lang);

    ensureDir(targetFontsDir);

    if (fs.existsSync(bnFontsDir)) {
        const fontFiles = fs.readdirSync(bnFontsDir).filter(f => f.endsWith('.ttf'));
        for (const file of fontFiles) {
            fs.copyFileSync(
                path.join(bnFontsDir, file),
                path.join(targetFontsDir, file)
            );
        }
        console.log(`  ✅ Cloned ${fontFiles.length} fonts from bn/ → ${input.lang}/ (primary.ttf, secondary.ttf, english.ttf)`);
    } else {
        console.log('  ⚠️  No bn/ fonts directory found. Creating empty folder.');
    }

    console.log('  💡 Replace fonts & images later with language-specific versions');
}

// ─── Step 4: Translate Chapter Data ──────────────────────────

async function translateChapterData(input: ClientInput) {
    console.log('\n📖 Translating chapter data (18 chapters)...');
    console.log('  ⏳ This may take 3–5 minutes due to API rate limiting.');
    console.log('  📝 Source language: English (en)\n');

    const enDataDir = path.join(PATHS.assetsData, 'en');
    const targetDataDir = path.join(PATHS.assetsData, input.lang);

    for (let ch = 1; ch <= 18; ch++) {
        const srcFile = path.join(enDataDir, `chapter${ch}.json`);
        const destFile = path.join(targetDataDir, `chapter${ch}.json`);

        if (!fs.existsSync(srcFile)) {
            console.warn(`  ⚠️  Source file not found: en/chapter${ch}.json — skipping`);
            continue;
        }

        const chapter = readJson(srcFile);

        process.stdout.write(`  📖 Chapter ${ch}/18: translating...`);

        // ── Translate chapter metadata ──
        chapter.chapter.number = await translateText(chapter.chapter.number, input.lang);
        chapter.chapter.title = await translateText(chapter.chapter.title, input.lang);
        chapter.chapter.subtitle = await translateText(chapter.chapter.subtitle, input.lang);
        chapter.chapter.totalVerses = await translateText(chapter.chapter.totalVerses, input.lang);
        chapter.chapter.description = await translateText(chapter.chapter.description, input.lang);
        // Keep: id, englishTitle

        // ── Translate dedication ──
        chapter.dedication.Language = await translateText(chapter.dedication.Language, input.lang);
        // Keep: meaning (English)

        // ── Translate verses ──
        const verseCount = chapter.verses?.length || 0;
        for (let v = 0; v < verseCount; v++) {
            const verse = chapter.verses[v];

            // Translate verse number and translation
            verse.verseNumber = await translateText(verse.verseNumber, input.lang);
            verse.translation = await translateText(verse.translation, input.lang);
            verse.speaker = await translateText(verse.speaker, input.lang);
            verse.Language = await translateText(verse.Language, input.lang);

            // Keep: id, speaker_english

            // Rate limit
            if (v > 0 && v % 10 === 0) {
                await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
                process.stdout.write(`\r  📖 Chapter ${ch}/18: verse ${v}/${verseCount}...`);
            }
        }

        // ── Translate summary ──
        if (chapter.summary) {
            chapter.summary.title = await translateText(chapter.summary.title, input.lang);
            chapter.summary.description = await translateText(chapter.summary.description, input.lang);
            if (Array.isArray(chapter.summary.keyThemes)) {
                chapter.summary.keyThemes = await translateBatch(chapter.summary.keyThemes, input.lang);
            }
        }

        // ── Translate metadata ──
        if (chapter.metadata) {
            chapter.metadata.language = LANG_NAMES[input.lang] || await translateText(chapter.metadata.language, input.lang);
            chapter.metadata.scripture = await translateText(chapter.metadata.scripture, input.lang);
            chapter.metadata.chapterType = await translateText(chapter.metadata.chapterType, input.lang);
            chapter.metadata.totalWords = await translateText(chapter.metadata.totalWords, input.lang);
            // Keep: source, lastUpdated
        }

        writeJson(destFile, chapter);
        process.stdout.write(`\r  ✅ Chapter ${ch}/18: ${verseCount} verses translated     \n`);
    }

    console.log('\n  🎉 All 18 chapters translated!');
}

// ─── Step 5: Translate UI Strings ────────────────────────────

async function translateUIStrings(input: ClientInput) {
    console.log('\n🌐 Translating UI strings...');
    console.log('  📝 Source language: English (en)');
    console.log('  ⏳ This may take 1–2 minutes.\n');

    const enFile = path.join(PATHS.i18nDir, 'en.json');
    const targetFile = path.join(PATHS.i18nDir, `${input.lang}.json`);

    if (!fs.existsSync(enFile)) {
        console.error('  ❌ Source file en.json not found!');
        return;
    }

    const enData = readJson(enFile);
    const translated = await deepTranslate(enData, input.lang);

    writeJson(targetFile, translated);
    console.log(`\n  ✅ Created ${input.lang}.json (${Object.keys(translated).length} sections — translated from English)`);
}

// ─── Step 6: Patch Source Files ──────────────────────────────

function patchDataIndex(input: ClientInput) {
    console.log('\n🔧 Patching assets/Data/index.ts...');

    let content = readText(PATHS.dataIndex);

    // Check if already patched
    if (content.includes(`${input.lang}Chapters`)) {
        console.log(`  ⚠️  Language "${input.lang}" already present. Skipping.`);
        return;
    }

    // Build the chapter import block
    const varName = `${input.lang}Chapters`;
    const importLines = Array.from({ length: 18 }, (_, i) =>
        `    require('./${input.lang}/chapter${i + 1}.json'),`
    ).join('\n');

    const importBlock = `\nconst ${varName} = [\n${importLines}\n];\n`;

    // Insert the import block before `const chaptersByLang`
    const chaptersByLangIndex = content.indexOf('const chaptersByLang');
    if (chaptersByLangIndex === -1) {
        console.error('  ❌ Could not find chaptersByLang in Data/index.ts');
        return;
    }

    content = content.slice(0, chaptersByLangIndex) + importBlock + content.slice(chaptersByLangIndex);

    // Add to chaptersByLang map — find the closing `};` of the map
    const mapStart = content.indexOf('const chaptersByLang');
    const mapOpenBrace = content.indexOf('{', mapStart);
    const mapCloseBrace = content.indexOf('};', mapOpenBrace);

    if (mapCloseBrace === -1) {
        console.error('  ❌ Could not find closing of chaptersByLang map');
        return;
    }

    // Insert before the closing `};`
    const insertEntry = `    ${input.lang}: ${varName},\n`;
    content = content.slice(0, mapCloseBrace) + insertEntry + content.slice(mapCloseBrace);

    writeText(PATHS.dataIndex, content);
    console.log('  ✅ Added chapter imports and chaptersByLang entry');
}

function patchI18nIndex(input: ClientInput) {
    console.log('\n🔧 Patching src/lib/i18n/index.ts...');

    let content = readText(PATHS.i18nIndex);

    // Check if already patched
    if (content.includes(`from './translations/${input.lang}.json'`)) {
        console.log(`  ⚠️  Language "${input.lang}" already present. Skipping.`);
        return;
    }

    // Determine import name — handle reserved keywords
    const reservedWords = ['as', 'do', 'if', 'in', 'is', 'or'];
    const importName = reservedWords.includes(input.lang) ? `${input.lang}_` : input.lang;

    // Add import line after the last existing import
    const lastImportIndex = content.lastIndexOf("from './translations/");
    const lastImportEndOfLine = content.indexOf('\n', lastImportIndex);
    const importLine = `import ${importName} from './translations/${input.lang}.json';`;

    content = content.slice(0, lastImportEndOfLine + 1) + importLine + '\n' + content.slice(lastImportEndOfLine + 1);

    // Add to translations map — find closing `};` of the translations object
    const translationsStart = content.indexOf('const translations');
    const translationsOpenBrace = content.indexOf('{', translationsStart);
    const translationsCloseBrace = content.indexOf('};', translationsOpenBrace);

    if (translationsCloseBrace === -1) {
        console.error('  ❌ Could not find closing of translations map');
        return;
    }

    const mapValue = importName !== input.lang ? `${input.lang}: ${importName}` : input.lang;
    const insertEntry = `    ${mapValue},\n`;
    content = content.slice(0, translationsCloseBrace) + insertEntry + content.slice(translationsCloseBrace);

    writeText(PATHS.i18nIndex, content);
    console.log('  ✅ Added import and translations entry');
}

function patchClientConfig(input: ClientInput) {
    console.log('\n🔧 Patching src/config/clientConfig.ts...');

    let content = readText(PATHS.clientConfig);

    // Check if already patched
    if (content.includes(`    ${input.lang}: {`)) {
        console.log(`  ⚠️  Language "${input.lang}" already present. Skipping.`);
        return;
    }

    // Find the closing `};` of the CLIENTS map
    const clientsStart = content.indexOf('const CLIENTS');
    const clientsOpenBrace = content.indexOf('{', clientsStart);

    // Find the correct closing brace of CLIENTS (not a nested one)
    let braceCount = 0;
    let clientsCloseBrace = -1;
    for (let i = clientsOpenBrace; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                clientsCloseBrace = i;
                break;
            }
        }
    }

    if (clientsCloseBrace === -1) {
        console.error('  ❌ Could not find closing of CLIENTS map');
        return;
    }

    const newEntry = `    ${input.lang}: {
        lang: '${input.lang}',
        appName: '${input.appName}',
        fontFamily: '${input.fontFamily}',
        scriptDirection: '${input.scriptDirection}',
    },\n`;

    content = content.slice(0, clientsCloseBrace) + newEntry + content.slice(clientsCloseBrace);

    writeText(PATHS.clientConfig, content);
    console.log('  ✅ Added client config entry');
}

function patchEasJson(input: ClientInput) {
    console.log('\n🔧 Patching eas.json...');

    const eas = readJson(PATHS.easJson);

    const apkProfile = `${input.lang}-apk`;
    const prodProfile = `${input.lang}-production`;

    if (eas.build[apkProfile]) {
        console.log(`  ⚠️  Profile "${apkProfile}" already exists. Skipping.`);
        return;
    }

    eas.build[apkProfile] = {
        extends: 'production',
        env: {
            APP_LANG: input.lang,
            APP_ENV: 'production',
        },
        channel: `${input.lang}-production`,
        android: {
            buildType: 'apk',
        },
    };

    eas.build[prodProfile] = {
        extends: 'production',
        env: {
            APP_LANG: input.lang,
            APP_ENV: 'production',
        },
        channel: `${input.lang}-production`,
    };

    writeJson(PATHS.easJson, eas);
    console.log(`  ✅ Added "${apkProfile}" and "${prodProfile}" build profiles`);
}

function patchPackageJson(input: ClientInput) {
    console.log('\n🔧 Patching package.json...');

    const pkg = readJson(PATHS.packageJson);

    const scriptPrefix = `APP_LANG=${input.lang} APP_ENV=development`;
    const scripts: Record<string, string> = {
        [`start:${input.lang}`]: `${scriptPrefix} expo start`,
        [`android:${input.lang}`]: `${scriptPrefix} expo run:android`,
        [`prebuild:android:${input.lang}`]: `${scriptPrefix} expo prebuild --platform android --clean`,
    };

    let added = 0;
    for (const [key, value] of Object.entries(scripts)) {
        if (!pkg.scripts[key]) {
            pkg.scripts[key] = value;
            added++;
        }
    }

    if (added > 0) {
        writeJson(PATHS.packageJson, pkg);
        console.log(`  ✅ Added ${added} npm scripts`);
    } else {
        console.log('  ⚠️  Scripts already exist. Skipping.');
    }
}

function patchGoogleServices(input: ClientInput) {
    console.log('\n🔧 Patching google-services.json...');

    if (!fs.existsSync(PATHS.googleServices)) {
        console.log('  ⚠️  google-services.json not found. Skipping.');
        return;
    }

    const gs = readJson(PATHS.googleServices);
    const packageName = `com.proninja.${input.packageSuffix}`;

    // Check if already exists
    const exists = gs.client?.some(
        (c: any) => c.client_info?.android_client_info?.package_name === packageName
    );

    if (exists) {
        console.log(`  ⚠️  Package "${packageName}" already registered. Skipping.`);
        return;
    }

    // Clone the first client entry and change the package name
    if (!gs.client || gs.client.length === 0) {
        console.error('  ❌ No existing client entries to clone from.');
        return;
    }

    const template = JSON.parse(JSON.stringify(gs.client[0]));
    template.client_info.android_client_info.package_name = packageName;

    gs.client.push(template);
    writeJson(PATHS.googleServices, gs);
    console.log(`  ✅ Added client entry for "${packageName}"`);
    console.log('  💡 Later, register this app properly in Firebase Console');
}

// ─── Step 7: Print Summary ───────────────────────────────────

function printSummary(input: ClientInput) {
    console.log('\n');
    console.log('  ════════════════════════════════════════════');
    console.log('  ✅  NEW CLIENT SETUP COMPLETE!');
    console.log('  ════════════════════════════════════════════');
    console.log('');
    console.log('  Files created:');
    console.log(`    📄 .env.${input.lang}.development`);
    console.log(`    📄 .env.${input.lang}.production`);
    console.log(`    📁 assets/images/${input.lang}/`);
    console.log(`    📁 assets/Data/${input.lang}/ (18 chapter JSONs)`);
    console.log(`    🌐 src/lib/i18n/translations/${input.lang}.json`);
    console.log('');
    console.log('  Files patched:');
    console.log('    🔧 assets/Data/index.ts');
    console.log('    🔧 src/lib/i18n/index.ts');
    console.log('    🔧 src/config/clientConfig.ts');
    console.log('    🔧 eas.json');
    console.log('    🔧 package.json');
    console.log('    🔧 google-services.json');
    console.log('');
    console.log('  ────────────────────────────────────────────');
    console.log('  📋 REMAINING MANUAL STEPS:');
    console.log('  ────────────────────────────────────────────');
    console.log('');
    console.log(`  1. Replace branding images in assets/images/${input.lang}/`);
    console.log('     (Currently cloned from bn/ — update with language-specific icons)');
    console.log('');
    console.log('  2. Review & fix machine-translated chapter data');
    console.log(`     (Check: assets/Data/${input.lang}/chapter*.json)`);
    console.log('');
    console.log('  3. Review & fix machine-translated UI strings');
    console.log(`     (Check: src/lib/i18n/translations/${input.lang}.json)`);
    console.log('');
    console.log(`  4. Update .env.${input.lang}.production with real keys:`);
    console.log('     • AdMob app + ad unit IDs');
    console.log('     • EAS project ID (run: eas init)');
    console.log('     (Supabase & RevenueCat keys already copied from bn)');
    console.log('');
    console.log('  5. Test locally:');
    console.log(`     npm run start:${input.lang}`);
    console.log('');
    console.log('  6. Build for production:');
    console.log(`     eas build --profile ${input.lang}-production --platform android`);
    console.log('');
    console.log('  ════════════════════════════════════════════\n');
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
    try {
        const input = await collectInput();
        rl.close();

        const startTime = Date.now();

        // Non-translation steps (fast)
        createEnvFiles(input);
        createAssetDirs(input);

        // Translation steps (slow — 3-5 min)
        await translateChapterData(input);
        await translateUIStrings(input);

        // Patch source files (fast)
        patchDataIndex(input);
        patchI18nIndex(input);
        patchClientConfig(input);
        patchEasJson(input);
        patchPackageJson(input);
        patchGoogleServices(input);

        const elapsed = Math.round((Date.now() - startTime) / 1000);
        console.log(`\n⏱️  Total time: ${elapsed} seconds`);

        printSummary(input);
    } catch (err) {
        console.error('\n❌ Fatal error:', err);
        process.exit(1);
    } finally {
        rl.close();
    }
}

main();
