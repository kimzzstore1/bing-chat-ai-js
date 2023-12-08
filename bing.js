const puppeteer = require('puppeteer')

function delay(time) {
  return new Promise(function(resolve) { 
    setTimeout(resolve, time)
  });
}

async function bot(question) {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('https://www.bing.com/account/general', {
    waitUntil: "domcontentloaded"
  });

  await page.click("#adlt_set_off");

  await page.click("#sv_btn");

  await page.click("#adlt_confirm");

  await page.waitForSelector("#codex > a", {visible: true});

  await page.click("#codex > a");

  // NOTE: need adjustment here to show the input question form
  await delay(5000)

  await page.type('>>> #searchbox', question);
  await page.keyboard.press('Enter', {delay: 160});

  await page.waitForSelector(">>> cib-message-group.response-message-group", {timeout: 60000});

  const shared_element = await page.waitForSelector(">>> cib-shared > div > div > div", {timeout: 0});
  const value = await shared_element.evaluate(el => el.textContent);
  console.log(value);

  await page.screenshot({
    path: 'bing-cib-message.png',
    fullPage: true,
  });
  
  await browser.close();

  return value;
}

module.exports = {
  bot
}