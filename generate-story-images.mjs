// Generates branded story card images for each story
// Usage: node generate-story-images.mjs
import puppeteer from 'puppeteer';
import { readFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stories = JSON.parse(readFileSync('stories.json', 'utf-8'));

const categoryColors = {
  'Developer Tools': '#D4754E',
  'Open Source AI': '#6B8F71',
  'Document Intelligence': '#5B7BA0',
  'Robotics & Physical AI': '#8B6BAE',
  'Enterprise AI': '#C0653E',
  'AI Safety & Evaluation': '#4A7C6F',
  'Open Data': '#7A6B5D',
};

function makeHtml(story) {
  const accent = categoryColors[story.category] || '#D4754E';
  return `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 800;
    height: 450;
    background: #1A1A1A;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }
  .circle {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: ${accent};
    opacity: 0.12;
    top: -80px;
    right: -60px;
  }
  .circle2 {
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: ${accent};
    opacity: 0.08;
    bottom: 40px;
    right: 200px;
  }
  .category {
    font-size: 13px;
    font-weight: 600;
    color: ${accent};
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 16px;
  }
  .company {
    font-size: 13px;
    font-weight: 400;
    color: rgba(255,255,255,0.4);
    margin-left: 12px;
    letter-spacing: 0;
    text-transform: none;
  }
  .title {
    font-size: 36px;
    font-weight: 900;
    color: #F5F1EB;
    line-height: 1.15;
    max-width: 650px;
  }
  .line {
    width: 50px;
    height: 3px;
    background: ${accent};
    margin-top: 24px;
    border-radius: 2px;
  }
  .logo {
    position: absolute;
    top: 40px;
    left: 48px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.3);
    letter-spacing: 1px;
  }
</style>
</head>
<body>
  <div class="circle"></div>
  <div class="circle2"></div>
  <div class="logo">AGENTIC AI FOR GOOD</div>
  <div class="category">${story.category}<span class="company">${story.company}</span></div>
  <div class="title">${story.title}</div>
  <div class="line"></div>
</body>
</html>`;
}

async function generate() {
  mkdirSync(path.join(__dirname, 'public', 'images', 'stories'), { recursive: true });
  const browser = await puppeteer.launch({ headless: true });

  for (const story of stories) {
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 450 });
    await page.setContent(makeHtml(story), { waitUntil: 'networkidle0' });
    const outPath = path.join(__dirname, 'public', 'images', 'stories', `${story.slug}.png`);
    await page.screenshot({ path: outPath, type: 'png' });
    await page.close();
    console.log(`Generated: ${story.slug}.png`);
  }

  await browser.close();
  console.log('\nAll story images generated!');
}

generate();
