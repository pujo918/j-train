import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:/Users/Pujo Lestariono/.gemini/antigravity/brain/cd8cd77b-eee9-4011-b5eb-e3a903ab6860';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function capture() {
  console.log('Launching browser to capture AudioInputSwitcher states...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
      '--window-size=1440,900', 
      '--use-fake-ui-for-media-stream', 
      '--use-fake-device-for-media-stream',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });

  const context = browser.defaultBrowserContext();
  await context.overridePermissions('http://localhost:3000', ['microphone']);

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to /sensei/kelola-paket...');
  await page.goto('http://localhost:3000/sensei/kelola-paket', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Ensure Sensei role
  const switchBtn = await page.$('button ::-p-text(Aktifkan Peran Sensei)');
  if (switchBtn) {
    console.log('Switching to Sensei role...');
    await switchBtn.click();
    await new Promise(r => setTimeout(r, 800));
  }

  // 1. Open Adaptive Package Modal for Rodoku
  console.log('Opening package modal with Rodoku category...');
  const addSetBtn = await page.$('button ::-p-text(Buat Paket Baru)');
  if (addSetBtn) {
    await addSetBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Select rodoku
    await page.select('select', 'rodoku');
    await new Promise(r => setTimeout(r, 600));

    // Tab 1: Rekam Langsung (Standby)
    const recStandbyImg = path.join(ARTIFACTS_DIR, 'kelola_paket_audio_recorder.png');
    await page.screenshot({ path: recStandbyImg, fullPage: false });
    console.log('Captured standby recorder:', recStandbyImg);

    // Click "Mulai Rekam Audio Sensei" to test recording state
    const startRecBtn = await page.$('button ::-p-text(Mulai Rekam Audio Sensei)');
    if (startRecBtn) {
      console.log('Starting live audio recording...');
      await startRecBtn.click();
      await new Promise(r => setTimeout(r, 1200));

      const liveRecImg = path.join(ARTIFACTS_DIR, 'kelola_paket_audio_recording_live.png');
      await page.screenshot({ path: liveRecImg, fullPage: false });
      console.log('Captured live recording with equalizer:', liveRecImg);

      // Stop recording
      const stopRecBtn = await page.$('button ::-p-text(Selesai Merekam)');
      if (stopRecBtn) {
        await stopRecBtn.click();
        await new Promise(r => setTimeout(r, 600));
        console.log('Stopped recording, now in preview state.');
      }
    }

    // Tab 2: Unggah File
    console.log('Switching to Unggah File tab...');
    const uploadTabBtn = await page.$('button ::-p-text(Unggah File)');
    if (uploadTabBtn) {
      await uploadTabBtn.click();
      await new Promise(r => setTimeout(r, 500));
      const uploaderImg = path.join(ARTIFACTS_DIR, 'kelola_paket_audio_uploader.png');
      await page.screenshot({ path: uploaderImg, fullPage: false });
      console.log('Captured dropzone uploader:', uploaderImg);
    }

    // Tab 3: Tautan / URL
    console.log('Switching to Tautan / URL tab...');
    const urlTabBtn = await page.$('button ::-p-text(Tautan / URL)');
    if (urlTabBtn) {
      await urlTabBtn.click();
      await new Promise(r => setTimeout(r, 500));

      // Input sample url into the audio url field
      const urlInput = await page.$('input[placeholder*="https://"]');
      if (urlInput) {
        await urlInput.type('https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg');
        await new Promise(r => setTimeout(r, 200));
      }

      const testBtn = await page.$('button ::-p-text(Tes Audio)');
      if (testBtn) {
        await testBtn.click();
        await new Promise(r => setTimeout(r, 800));
      }

      const urlImg = path.join(ARTIFACTS_DIR, 'kelola_paket_audio_url.png');
      await page.screenshot({ path: urlImg, fullPage: false });
      console.log('Captured external URL tester:', urlImg);
    }

    // Close package modal
    const cancelBtn = await page.$('button ::-p-text(Batal)');
    if (cancelBtn) {
      await cancelBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // 2. Select a Seiyu set in left pane using category filter
  console.log('Filtering by Seiyu category and selecting package...');
  const seiyuFilterBtn = await page.$('button ::-p-text(Seiyu)');
  if (seiyuFilterBtn) {
    await seiyuFilterBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  // Click the Seiyu package card
  const seiyuCard = await page.$('::-p-text(Naskah Sulih Suara Anime)');
  if (seiyuCard) {
    await seiyuCard.click();
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('Opening Adaptive Question Modal on Seiyu...');
  const addQBtn = await page.$('button ::-p-text(Tambah Butir Soal)');
  if (addQBtn) {
    await addQBtn.click();
    await new Promise(r => setTimeout(r, 800));

    const qAudioImg = path.join(ARTIFACTS_DIR, 'kelola_paket_adaptive_question_audio.png');
    await page.screenshot({ path: qAudioImg, fullPage: false });
    console.log('Captured question modal with audio switcher:', qAudioImg);
  }

  await browser.close();
  console.log('Finished capturing AudioInputSwitcher screenshots successfully!');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
