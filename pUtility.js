#!/usr/bin/env node

const program = require('commander');
const puppeteer = require('puppeteer-core');

program
  .name('./pUtility.js')
  .usage('<url> [-u <user_agent>] [-w <seconds>] [-p <path>] [-c <cmd1,cmd2...>] [-s]')
  .option('-u, --agent <user_agent>', 'optional, browser user agent')
  .option('-w, --wait <millisecond>', 'optional, waitfor n milliseconds')
  .option('-p, --path <binary_path>', 'optional, path to chrome/chromium binary\ndefault "/usr/bin/chromium"')
  .option('-c, --cmd <cmd1,cmd2...>', 'optional, one or multiple commands:\n["html", "screenshot", "cookie", "header"]\ndefault "html"')
  .option('-s, --show', 'optional, show browser\ndefault not show')
  .arguments('<url>')
  .action(function (url) {
    _URL = url;
  });

program.parse(process.argv);

const cPath = (program.path === undefined) ? '/usr/bin/chromium' : program.path;
const hMode = (program.show === undefined) ? true : false;
const wMsec = (program.wait === undefined) ? '' : parseInt(program.wait);
const cExec = (program.cmd === undefined) ? 'html' : program.cmd;
const tStamp = Math.floor(Date.now() / 1000);

(async() => {
  const browser = await puppeteer.launch({executablePath: cPath, headless: hMode});
  const page = await browser.newPage();
  var uAgent = (program.agent === undefined) ? await browser.userAgent() : program.agent;
  uAgent = uAgent.replace('Headless', '');

  /* fetch response header*/
  if (cExec.indexOf('header') !== -1) {
    page.on('response', r => {
      if (r.url() == _URL)
        console.log(r.headers())
    });
  }

  await page.setUserAgent(uAgent);
  await page.goto(_URL, {timeout: 30000, waitUntil: 'domcontentloaded'});

  if (wMsec !== '') {
    await page.waitFor(wMsec);
  } else {
    await page.waitForNavigation();
  }

  /* take screenshot */
  if (cExec.indexOf('screenshot') !== -1) {
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
