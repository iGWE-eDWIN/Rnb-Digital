import fs from 'fs';
import path from 'path';

const brainLogo = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\f273a332-0352-403d-bd29-65c1454772da\\.user_uploaded\\media_1789278280451.png';
const publicDir = path.join(process.cwd(), 'public');
const targetLogo = path.join(publicDir, 'logo.png');
const base64File = path.join(process.cwd(), 'src', 'lib', 'logo-base64.ts');

export function initLogo() {
  if (typeof window !== 'undefined') return;

  try {
    if (fs.existsSync(brainLogo)) {
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.copyFileSync(brainLogo, targetLogo);
      const rootLogo = path.join(process.cwd(), 'logo.png');
      fs.copyFileSync(brainLogo, rootLogo);

      const buffer = fs.readFileSync(brainLogo);
      const base64Str = `data:image/png;base64,${buffer.toString('base64')}`;
      fs.writeFileSync(base64File, `export const LOGO_IMAGE_SRC = "${base64Str}";\n`);
    }
  } catch (err) {
    console.error('Logo init error:', err);
  }
}

initLogo();
