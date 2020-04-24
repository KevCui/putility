#!/usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer-core');

program
  .name('./puppeteer-utilities.js')
  .usage('<url> [-w <seconds>] [-p <path>] [-c <cmd1,cmd2...>] [-s]')
  .option('-w, --wait <millisecond>', 'optional, waitfor n milliseconds')
  .option('-p, --path <binary_path>', 'optional, path to chrome/chromium binary\ndefault "/usr/bin/chromium"')
  .option('-c, --command <cmd1,cmd2...>', 'optional, one or multiple commands:\n["screenshot", "html", "cookie"]\ndefault "screenshot"')
  .option('-s, --show', 'optional, show browser\ndefault not show')
  .arguments('<url>')
  .action(function (url) {
    _URL = url;
  });

program.parse(process.argv);

const cPath = (program.path === undefined) ? '/usr/bin/chromium' : program.path;
const hMode = (program.show === undefined) ? true : false;
const wMsec = (program.wait === undefined) ? '' : parseInt(program.wait);
const cExec = (program.command === undefined) ? '' : program.command;

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

  /* take screenshot */
  if (cExec === '' || cExec.indexOf('screenshot') !== -1) {
    await page.screenshot({path:'./' + tStamp + '.jpg', type: 'jpeg', fullPage: true});
  }

  /* fetch html */
  if (cExec.indexOf('html') !== -1) {
    const html = await page.evaluate(function () {
      return document.getElementsByTagName('html')[0].innerHTML;
    });
    console.log(html);
  }

  /* fetch cookie */
  if (cExec.indexOf('cookie') !== -1) {
    const cookie = await page.cookies();
    console.log(JSON.stringify(cookie));
  }

  await browser.close();
})();
