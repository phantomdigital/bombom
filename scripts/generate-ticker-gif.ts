/**
 * Generates seamless ticker GIF using marquee technique.
 * Measures exact content width, then animates 0% → -100% for perfect loop.
 * Run: npm run email:generate-ticker
 */

import { copyFileSync, createWriteStream, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const puppeteer = require('puppeteer');
const GIFEncoder = require('gif-encoder');

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUTPUT = resolve(ROOT, 'public/email/ticker.gif');
/** Same folder as logo - React Email preview serves `emails/static` at `/static/*` */
const EMAIL_PREVIEW_TICKER = resolve(ROOT, 'emails/static/images/ticker.gif');

const WIDTH = 600;
const HEIGHT = 32;
/** 12–16 fps is enough for text marquee; fewer frames = much faster runs. */
const FPS = 14;
const DURATION_SEC = 12;
const FRAME_COUNT = FPS * DURATION_SEC;

const ITEMS = ['Frozen Yoghurt', 'Soft Serve', 'Ice Cream'];
const GAP_PX = 80;

// Create items HTML where each item has equal padding on both sides
const itemsHtml = ITEMS.map(text => `<span style="padding: 0 ${GAP_PX / 2}px">${text}</span>`).join('');

// Marquee HTML: single text element + copies container 
const HTML = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
@font-face{font-family:"saans";src:url("https://bombomtreats.com.au/fonts/SaansRegular.otf")format("opentype");font-weight:400}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:#91c4ff;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}
.marquee{position:absolute;left:0;top:50%;transform:translateY(-50%);width:100%;height:100%;display:flex;overflow:hidden}
.marquee__content{display:flex;flex-direction:row;align-items:center;flex-shrink:0}
.marquee__text{display:flex;flex-direction:row;flex-shrink:0;margin:0;font-family:"saans",-apple-system,sans-serif;font-size:18px;line-height:1;color:#fff;white-space:nowrap}
.marquee__copies{display:flex;flex-direction:row;align-items:center}
</style></head><body>
<div class="marquee">
  <div class="marquee__content" id="content">
    <p class="marquee__text" id="text">${itemsHtml}</p>
    <div class="marquee__copies" id="copies"></div>
  </div>
</div>
</body></html>`;

/** Native decode/resize - `png-js` per frame was the main cost (minutes on long GIFs). */
async function screenshotToRgba(buf: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(buf)
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (info.channels !== 4) {
    throw new Error(`Expected RGBA from sharp, got ${info.channels} channels`);
  }
  return Buffer.from(data);
}

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--disable-dev-shm-usage', '--disable-gpu', '--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
  });
  await page.setContent(HTML);
  await page.evaluateOnNewDocument(() => document.fonts?.ready);
  await new Promise(r => setTimeout(r, 500));

  // Measure text width and create copies (like the CodePen JS)
  console.log('Measuring and creating copies...');
  const textWidth = await page.evaluate(() => {
    const text = document.getElementById('text')!;
    const width = text.offsetWidth;
    
    // Create enough copies to fill viewport + 1
    const copies = document.getElementById('copies')!;
    const numCopies = Math.ceil(600 / width) + 1;
    
    for (let i = 0; i < numCopies; i++) {
      const clone = text.cloneNode(true) as HTMLElement;
      copies.appendChild(clone);
    }
    
    return width;
  });

  console.log(`Text width: ${textWidth}px, generating ${FRAME_COUNT} frames...`);

  mkdirSync(dirname(OUTPUT), { recursive: true });
  const stream = createWriteStream(OUTPUT);
  const enc = new GIFEncoder(WIDTH, HEIGHT);
  enc.pipe(stream);
  enc.setRepeat(0);
  enc.setDelay(Math.round(1000 / FPS));
  enc.setQuality(10);
  enc.writeHeader();

  // Animate from 0 to textWidth (one full cycle, capturing N frames but NOT the final frame that equals frame 0)
  for (let i = 0; i < FRAME_COUNT; i++) {
    // Key fix: divide by FRAME_COUNT so we go 0/100, 1/100, ... 99/100 (never reaching 100/100)
    // This gives us progress from 0 to 0.99, and when GIF loops from 0.99 → 0, it's seamless
    // because the copies make 0.99*textWidth look almost identical to 0*textWidth
    const progress = i / FRAME_COUNT;
    const translateX = -(textWidth * progress);
    
    await page.evaluate((x: number) => {
      const content = document.getElementById('content')!;
      content.style.transform = `translateX(${x}px)`;
    }, translateX);
    
    const buf = (await page.screenshot({
      type: 'png',
      omitBackground: false,
    })) as Buffer;
    const pixels = await screenshotToRgba(buf);
    enc.addFrame(pixels);
    
    if ((i + 1) % 20 === 0 || i === FRAME_COUNT - 1) {
      console.log(`  ${i + 1}/${FRAME_COUNT} frames (offset: ${Math.round(translateX)}px)`);
    }
  }

  enc.finish();
  await new Promise<void>((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  await browser.close();
  mkdirSync(dirname(EMAIL_PREVIEW_TICKER), { recursive: true });
  copyFileSync(OUTPUT, EMAIL_PREVIEW_TICKER);
  console.log(`✓ Seamless ticker generated: ${OUTPUT}`);
  console.log(`  Copied to emails/static/images/ticker.gif (React Email preview)`);
  console.log(`  Loop: 0 → -${textWidth}px over ${DURATION_SEC}s`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
