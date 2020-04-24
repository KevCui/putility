#!/usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer-core');

program
  .name('./fetchCookie.js')
  .usage('<url> [-w <seconds>] [-p <path>] [-s]')
  .option('-w, --wait <millisecond>', 'optional, waitfor n milliseconds')
  .option('-p, --path <binary_path>', 'optional, path to chrome/chromium binary\ndefault "/usr/bin/chromium"')
  .option('-s, --show', 'optional, show browser\ndefault not show')
  .arguments('<url>')
  .action(function (url) {
    _URL = url;
  });

program.parse(process.argv);

const cPath = (program.path === undefined) ? '/usr/bin/chromium' : program.path;
const hMode = (program.show === undefined) ? true : false;
const wMsec = (program.wait === undefined) ? '' : parseInt(program.wait);

(async() => {
  const browser = await puppeteer.launch({executablePath: cPath, headless: hMode});
  const page = await browser.newPage();
  const dAgent = await browser.userAgent();
  const uAgent = dAgent.replace('Headless', '');
  const tStamp = Math.floor(Date.now() / 1000);

  await page.setUserAgent(uAgent);
  await page.goto(_URL, {timeout: 30000, waitUntil: 'domcontentloaded'});

  if (wMsec !== '') {
    await page.waitFor(wMsec);
  } else {
    await page.waitForNavigation();
  }

  await page.screenshot({path:'./' + tStamp + '.jpg', type: 'jpeg', fullPage: true});

  await browser.close();
})();
