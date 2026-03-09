const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/lib/i18n/translations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'bn.json');

for (const file of files) {
    const filePath = path.join(dir, file);
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.allEkadashi) {
            delete data.allEkadashi;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
            console.log(`Deleted allEkadashi from ${file}`);
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
}
