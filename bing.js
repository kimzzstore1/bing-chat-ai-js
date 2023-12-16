const puppeteer = require('puppeteer-core');

async function bot(question) {
  try {
   const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_BIN || '/app/.apt/usr/bin/google-chrome', // Sesuaikan path jika diperlukan
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.goto('https://www.bing.com/account/general', {
      waitUntil: 'domcontentloaded',
    });

    await page.click('#adlt_set_off');
    await page.click('#sv_btn');
    await page.click('#adlt_confirm');

    await page.waitForSelector('#codex > a', { visible: true });
    await page.click('#codex > a');

    // NOTE: Perlu penyesuaian di sini untuk menampilkan formulir pertanyaan input
    await page.waitForTimeout(5000);

    await page.type('>>> #searchbox', question);
    await page.keyboard.press('Enter', { delay: 160 });

    await page.waitForSelector('>>> cib-message-group.response-message-group', { timeout: 60000 });

    const sharedElement = await page.waitForSelector('>>> cib-shared > div > div > div', { timeout: 0 });
    const value = await sharedElement.evaluate(el => el.textContent);
    console.log(value);

    await page.screenshot({
      path: 'bing-cib-message.png',
      fullPage: true,
    });

    await browser.close();

    return value;
  } catch (error) {
    console.error(error);
    return 'Gagal menjalankan bot Bing.';
  }
}

module.exports = {
  bot,
};
