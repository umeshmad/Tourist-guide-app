const fs = require('fs');
const https = require('https');
const path = require('path');

const icons = [
  'info', 'star_rate', 'expand_more', 'attach_money', 'check', 'location_on',
  'image', 'arrow_back', 'domain', 'add_business', 'logout', 'add', 'edit',
  'upload', 'error', 'close', 'check_circle', 'schedule', 'wifi', 'pool',
  'local_parking', 'restaurant', 'ac_unit', 'beach_access', 'kitchen',
  'child_friendly', 'yard', 'account_balance', 'group', 'hourglass_top',
  'login', 'person_add', 'lock', 'shield'
];

const outDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function downloadIcon(icon) {
  // Official material symbols outlined SVG path
  const url = `https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/${icon}/materialsymbolsoutlined/${icon}_24px.svg`;
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          fs.writeFileSync(path.join(outDir, `${icon}.svg`), body);
          console.log(`Downloaded ${icon}.svg`);
          resolve();
        });
      } else {
        // Some icons might not match the exact naming, fallback to another source if needed
        console.error(`Failed to download ${icon}.svg: ${res.statusCode}`);
        resolve(); // Continue anyway
      }
    }).on('error', reject);
  });
}

async function run() {
  for (const icon of icons) {
    await downloadIcon(icon);
  }
}

run();
