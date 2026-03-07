/**
 * ============================================================
 *  🗑️  Remove Language Client Script
 * ============================================================
 *
 *  Usage:  npm run remove-client
 *          npx tsx scripts/remove-client.ts
 *
 *  This script reverses everything done by new-client.ts:
 *
 *   1. Prompts for the language code to remove
 *   2. Deletes .env files (dev + prod)
 *   3. Deletes asset directories (images, fonts, data)
 *   4. Deletes UI translation file
 *   5. Unpatches Data/index.ts, i18n/index.ts, assets.ts,
 *      clientConfig.ts, eas.json, and package.json
 *
 *  Protected languages (bn, en) cannot be removed.
 * ============================================================
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

// ─── Paths ───────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const PATHS = {
    assetsImages: path.join(ROOT, 'assets/images'),
    assetsFonts: path.join(ROOT, 'assets/fonts'),
    assetsData: path.join(ROOT, 'assets/Data'),
    dataIndex: path.join(ROOT, 'assets/Data/index.ts'),
    assetsTs: path.join(ROOT, 'src/lib/utils/assets.ts'),
    i18nDir: path.join(ROOT, 'src/lib/i18n/translations'),
    i18nIndex: path.join(ROOT, 'src/lib/i18n/index.ts'),
    clientConfig: path.join(ROOT, 'src/config/clientConfig.ts'),
    easJson: path.join(ROOT, 'eas.json'),
    packageJson: path.join(ROOT, 'package.json'),
    googleServices: path.join(ROOT, 'google-services.json'),
};

// ─── Protected languages that cannot be removed ──────────────

const PROTECTED_LANGS = ['bn', 'en'];

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

function removeDir(dirPath: string): boolean {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        return true;
    }
    return false;
}

function removeFile(filePath: string): boolean {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
    }
    return false;
}

// ─── Step 1: Collect Input ───────────────────────────────────

async function collectInput(): Promise<string> {
    console.log('\n🗑️  Remove Language Client\n');

    // Show existing clients
    const dataDir = PATHS.assetsData;
    const existing = fs.readdirSync(dataDir)
        .filter(f => fs.statSync(path.join(dataDir, f)).isDirectory())
        .filter(f => !PROTECTED_LANGS.includes(f))
        .sort();

    if (existing.length === 0) {
        console.log('  No removable clients found (bn and en are protected).');
        process.exit(0);
    }

    console.log('  Removable clients: ' + existing.join(', '));
    console.log(`  Protected (cannot remove): ${PROTECTED_LANGS.join(', ')}\n`);

    const lang = await ask('Language code to remove');

    if (!lang) {
        console.error('❌ No language code provided.');
        process.exit(1);
    }

    if (PROTECTED_LANGS.includes(lang)) {
        console.error(`❌ Cannot remove "${lang}" — it is a protected base language.`);
        process.exit(1);
    }

    // Check if exists
    const hasData = fs.existsSync(path.join(PATHS.assetsData, lang));
    const hasTranslation = fs.existsSync(path.join(PATHS.i18nDir, `${lang}.json`));
    const hasImages = fs.existsSync(path.join(PATHS.assetsImages, lang));
    const hasFonts = fs.existsSync(path.join(PATHS.assetsFonts, lang));

    if (!hasData && !hasTranslation && !hasImages && !hasFonts) {
        console.error(`❌ No files found for language "${lang}".`);
        process.exit(1);
    }

    console.log('\n  Will remove:');
    if (hasData) console.log(`    📁 assets/Data/${lang}/ (chapter data)`);
    if (hasImages) console.log(`    📁 assets/images/${lang}/ (branding images)`);
    if (hasFonts) console.log(`    📁 assets/fonts/${lang}/ (font files)`);
    if (hasTranslation) console.log(`    🌐 src/lib/i18n/translations/${lang}.json`);
    console.log(`    📄 .env.${lang}.development`);
    console.log(`    📄 .env.${lang}.production`);
    console.log('    🔧 Entries in: Data/index.ts, i18n/index.ts, assets.ts, clientConfig.ts, eas.json, package.json');

    console.log('');
    const confirm = await ask('⚠️  This is DESTRUCTIVE and cannot be undone. Proceed? (y/N)', 'N');
    if (confirm.toLowerCase() !== 'y') {
        console.log('Aborted.');
        process.exit(0);
    }

    return lang;
}

// ─── Step 2: Delete Files & Directories ──────────────────────

function deleteFiles(lang: string) {
    console.log('\n🗑️  Deleting files and directories...');

    // Data directory
    if (removeDir(path.join(PATHS.assetsData, lang))) {
        console.log(`  ✅ Deleted assets/Data/${lang}/`);
    }

    // Images directory
    if (removeDir(path.join(PATHS.assetsImages, lang))) {
        console.log(`  ✅ Deleted assets/images/${lang}/`);
    }

    // Fonts directory
    if (removeDir(path.join(PATHS.assetsFonts, lang))) {
        console.log(`  ✅ Deleted assets/fonts/${lang}/`);
    }

    // Translation file
    if (removeFile(path.join(PATHS.i18nDir, `${lang}.json`))) {
        console.log(`  ✅ Deleted src/lib/i18n/translations/${lang}.json`);
    }

    // Env files
    if (removeFile(path.join(ROOT, `.env.${lang}.development`))) {
        console.log(`  ✅ Deleted .env.${lang}.development`);
    }
    if (removeFile(path.join(ROOT, `.env.${lang}.production`))) {
        console.log(`  ✅ Deleted .env.${lang}.production`);
    }
}

// ─── Step 3: Unpatch Source Files ────────────────────────────

function unpatchDataIndex(lang: string) {
    console.log('\n🔧 Unpatching assets/Data/index.ts...');

    let content = readText(PATHS.dataIndex);
    const varName = `${lang}Chapters`;

    if (!content.includes(varName)) {
        console.log(`  ⚠️  Language "${lang}" not found. Skipping.`);
        return;
    }

    // Remove the chapter import block: `const xxChapters = [\n  ...\n];\n`
    const blockStart = content.indexOf(`const ${varName}`);
    if (blockStart !== -1) {
        const blockEnd = content.indexOf('];\n', blockStart);
        if (blockEnd !== -1) {
            // Also remove any leading newline
            let start = blockStart;
            if (start > 0 && content[start - 1] === '\n') start--;
            content = content.slice(0, start) + content.slice(blockEnd + 3);
        }
    }

    // Remove from chaptersByLang map
    const entryRegex = new RegExp(`\\s*${lang}:\\s*${varName},?\\n`, 'g');
    content = content.replace(entryRegex, '\n');

    writeText(PATHS.dataIndex, content);
    console.log('  ✅ Removed chapter imports and chaptersByLang entry');
}

function unpatchI18nIndex(lang: string) {
    console.log('\n🔧 Unpatching src/lib/i18n/index.ts...');

    let content = readText(PATHS.i18nIndex);

    if (!content.includes(`'./translations/${lang}.json'`)) {
        console.log(`  ⚠️  Language "${lang}" not found. Skipping.`);
        return;
    }

    // Remove import line
    const importRegex = new RegExp(`import \\w+ from './translations/${lang}\\.json';\\n`, 'g');
    content = content.replace(importRegex, '');

    // Remove from translations map — handle both `lang,` and `lang: lang_,`
    const reservedWords = ['as', 'do', 'if', 'in', 'is', 'or'];
    if (reservedWords.includes(lang)) {
        const entryRegex = new RegExp(`\\s*${lang}:\\s*${lang}_,?\\n`, 'g');
        content = content.replace(entryRegex, '\n');
    } else {
        const entryRegex = new RegExp(`\\s*${lang},?\\n`, 'g');
        content = content.replace(entryRegex, '\n');
    }

    writeText(PATHS.i18nIndex, content);
    console.log('  ✅ Removed import and translations entry');
}

function unpatchAssetsTs(lang: string) {
    console.log('\n🔧 Unpatching src/lib/utils/assets.ts...');

    let content = readText(PATHS.assetsTs);

    if (!content.includes(`assets/fonts/${lang}/`)) {
        console.log(`  ⚠️  Language "${lang}" not found. Skipping.`);
        return;
    }

    // Remove LANGUAGE_FONTS entry block
    const fontsEntryRegex = new RegExp(
        `\\s*${lang}:\\s*\\{[^}]*assets/fonts/${lang}/[^}]*\\},?\\n`,
        's'
    );
    content = content.replace(fontsEntryRegex, '\n');
    console.log('  ✅ Removed LANGUAGE_FONTS entry');

    // Remove LANGUAGE_IMAGES entry block
    const imagesEntryRegex = new RegExp(
        `\\s*${lang}:\\s*\\{[^}]*assets/images/${lang}/[^}]*\\},?\\n`,
        's'
    );
    content = content.replace(imagesEntryRegex, '\n');
    console.log('  ✅ Removed LANGUAGE_IMAGES entry');

    writeText(PATHS.assetsTs, content);
}

function unpatchClientConfig(lang: string) {
    console.log('\n🔧 Unpatching src/config/clientConfig.ts...');

    let content = readText(PATHS.clientConfig);

    if (!content.includes(`    ${lang}: {`)) {
        console.log(`  ⚠️  Language "${lang}" not found. Skipping.`);
        return;
    }

    // Remove the client config block: `    xx: {\n        ...\n    },\n`
    const blockStart = content.indexOf(`    ${lang}: {`);
    if (blockStart !== -1) {
        // Find the matching closing `},`
        let braceCount = 0;
        let blockEnd = -1;
        for (let i = blockStart; i < content.length; i++) {
            if (content[i] === '{') braceCount++;
            if (content[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    // Include the trailing `,\n`
                    blockEnd = i + 1;
                    if (content[blockEnd] === ',') blockEnd++;
                    if (content[blockEnd] === '\n') blockEnd++;
                    break;
                }
            }
        }

        if (blockEnd !== -1) {
            content = content.slice(0, blockStart) + content.slice(blockEnd);
        }
    }

    writeText(PATHS.clientConfig, content);
    console.log('  ✅ Removed client config entry');
}

function unpatchEasJson(lang: string) {
    console.log('\n🔧 Unpatching eas.json...');

    const eas = readJson(PATHS.easJson);
    let removed = 0;

    const profiles = [`${lang}-apk`, `${lang}-production`, lang];
    for (const profile of profiles) {
        if (eas.build[profile]) {
            delete eas.build[profile];
            removed++;
        }
    }

    if (removed > 0) {
        writeJson(PATHS.easJson, eas);
        console.log(`  ✅ Removed ${removed} build profile(s)`);
    } else {
        console.log('  ⚠️  No build profiles found. Skipping.');
    }
}

function unpatchPackageJson(lang: string) {
    console.log('\n🔧 Unpatching package.json...');

    const pkg = readJson(PATHS.packageJson);

    const scriptKeys = [
        `start:${lang}`,
        `android:${lang}`,
        `prebuild:android:${lang}`,
    ];

    let removed = 0;
    for (const key of scriptKeys) {
        if (pkg.scripts[key]) {
            delete pkg.scripts[key];
            removed++;
        }
    }

    if (removed > 0) {
        writeJson(PATHS.packageJson, pkg);
        console.log(`  ✅ Removed ${removed} npm script(s)`);
    } else {
        console.log('  ⚠️  No scripts found. Skipping.');
    }
}

function unpatchGoogleServices(lang: string) {
    console.log('\n🔧 Unpatching google-services.json...');

    if (!fs.existsSync(PATHS.googleServices)) {
        console.log('  ⚠️  google-services.json not found. Skipping.');
        return;
    }

    const gs = readJson(PATHS.googleServices);

    // We need the package suffix. We can read it from env file if it exists,
    // otherwise try to guess it.
    let packageName = `com.proninja.bhagavad_gita_${lang}`;
    const envFile = path.join(ROOT, `.env.${lang}.development`);

    if (fs.existsSync(envFile)) {
        const lines = readText(envFile).split('\n');
        const pkgLine = lines.find(l => l.startsWith('APP_PACKAGE='));
        if (pkgLine) {
            packageName = pkgLine.split('=')[1].trim();
        }
    }

    if (!gs.client) {
        console.log('  ⚠️  No clients array found in google-services.json.');
        return;
    }

    const originalLength = gs.client.length;
    gs.client = gs.client.filter(
        (c: any) => c.client_info?.android_client_info?.package_name !== packageName
    );

    if (gs.client.length < originalLength) {
        writeJson(PATHS.googleServices, gs);
        console.log(`  ✅ Removed client entry for "${packageName}"`);
    } else {
        console.log(`  ⚠️  Package "${packageName}" not found. Skipping.`);
    }
}

// ─── Step 4: Print Summary ──────────────────────────────────

function printSummary(lang: string) {
    console.log('\n');
    console.log('  ════════════════════════════════════════════');
    console.log('  ✅  CLIENT REMOVED SUCCESSFULLY!');
    console.log('  ════════════════════════════════════════════');
    console.log('');
    console.log(`  Language "${lang}" has been fully removed.`);
    console.log('');
    console.log('  Deleted:');
    console.log(`    📁 assets/Data/${lang}/`);
    console.log(`    📁 assets/images/${lang}/`);
    console.log(`    📁 assets/fonts/${lang}/`);
    console.log(`    🌐 translations/${lang}.json`);
    console.log(`    📄 .env.${lang}.development`);
    console.log(`    📄 .env.${lang}.production`);
    console.log('');
    console.log('  Unpatched:');
    console.log('    🔧 assets/Data/index.ts');
    console.log('    🔧 src/lib/i18n/index.ts');
    console.log('    🔧 src/lib/utils/assets.ts');
    console.log('    🔧 src/config/clientConfig.ts');
    console.log('    🔧 eas.json');
    console.log('    🔧 package.json');
    console.log('    🔧 google-services.json');
    console.log('');
    console.log('  ════════════════════════════════════════════\n');
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
    try {
        const lang = await collectInput();
        rl.close();

        const startTime = Date.now();

        // Delete files and directories
        deleteFiles(lang);

        // Unpatch source files
        unpatchDataIndex(lang);
        unpatchI18nIndex(lang);
        unpatchAssetsTs(lang);
        unpatchClientConfig(lang);
        unpatchEasJson(lang);
        unpatchPackageJson(lang);
        unpatchGoogleServices(lang);

        const elapsed = Math.round((Date.now() - startTime) / 1000);
        console.log(`\n⏱️  Total time: ${elapsed} seconds`);

        printSummary(lang);
    } catch (err) {
        console.error('\n❌ Fatal error:', err);
        process.exit(1);
    } finally {
        rl.close();
    }
}

main();
