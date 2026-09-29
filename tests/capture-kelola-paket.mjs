import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/Pujo Lestariono/.gemini/antigravity/brain/cd8cd77b-eee9-4011-b5eb-e3a903ab6860';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  console.log('Launching browser to capture Kelola Paket & Bank Soal...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Capture Default 2-Pane Workbench
  console.log('Navigating to /sensei/kelola-paket...');
  await page.goto('http://localhost:3000/sensei/kelola-paket', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Switch role to Sensei if role banner is visible
  const switchBtn = await page.$('button ::-p-text(Aktifkan Peran Sensei)');
  if (switchBtn) {
    console.log('Switching to Sensei role...');
    await switchBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // Ensure item 5 is expanded
  const q5 = await page.$('::-p-text(Apa padanan makna yang paling tepat)');
  if (q5) {
    // Check if expanded, or click
    console.log('Found Q5 in accordion...');
  }

  const workbenchImg = path.join(ARTIFACTS_DIR, 'kelola_paket_workbench.png');
  await page.screenshot({ path: workbenchImg, fullPage: false });
  console.log('Captured:', workbenchImg);

  // 2. Open CSV Import Modal and load sample data
  console.log('Opening CSV Import Modal...');
  const csvBtn = await page.$('button ::-p-text(Import via CSV)');
  if (csvBtn) {
    await csvBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Click sample data button inside modal
    const sampleBtn = await page.$('button ::-p-text(Muat Contoh Uji Coba)');
    if (sampleBtn) {
      await sampleBtn.click();
      await new Promise(r => setTimeout(r, 800));
    }

    const csvImg = path.join(ARTIFACTS_DIR, 'kelola_paket_csv_modal.png');
    await page.screenshot({ path: csvImg, fullPage: false });
    console.log('Captured:', csvImg);

    // Close CSV modal
    const closeCsvBtn = await page.$('button ::-p-text(Tutup)');
    if (closeCsvBtn) {
      await closeCsvBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // 3. Open Adaptive Package Modal
  console.log('Opening Adaptive Package Modal...');
  const addSetBtn = await page.$('button ::-p-text(Buat Paket Baru)');
  if (addSetBtn) {
    await addSetBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Select Seiyu or Rodoku to demonstrate dynamic conditional schema
    await page.select('select', 'seiyu');
    await new Promise(r => setTimeout(r, 600));

    const pkgModalImg = path.join(ARTIFACTS_DIR, 'kelola_paket_adaptive_modal.png');
    await page.screenshot({ path: pkgModalImg, fullPage: false });
    console.log('Captured:', pkgModalImg);

    // Close Package modal
    const cancelBtn = await page.$('button ::-p-text(Batal)');
    if (cancelBtn) {
      await cancelBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // 4. Open Adaptive Question Modal
  console.log('Opening Adaptive Question Modal...');
  const addQBtn = await page.$('button ::-p-text(Tambah Butir Soal)');
  if (addQBtn) {
    await addQBtn.click();
    await new Promise(r => setTimeout(r, 600));

    const qModalImg = path.join(ARTIFACTS_DIR, 'kelola_paket_adaptive_question_modal.png');
    await page.screenshot({ path: qModalImg, fullPage: false });
    console.log('Captured:', qModalImg);

    const cancelQBtn = await page.$('button ::-p-text(Batal)');
    if (cancelQBtn) {
      await cancelQBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
