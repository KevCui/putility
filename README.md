pUtility
=========

pUtility.js is a [puppeteer](https://github.com/puppeteer/puppeteer/) script toolkit. It contains some small and useful functions for daily usage.

## Dependency

- [puppeteer-core](https://github.com/puppeteer/puppeteer/): core library of puppeteer, headless Chrome
- [commander](https://github.com/tj/commander.js): argument options parser

## Installation

```bash
npm i puppeteer-core commander
```

## How to use

```
Usage: ./pUtility.js <url> [-u <user_agent>] [-w <seconds>] [-p <path>] [-c <cmd1,cmd2...>] [-s]

Options:
  -u, --agent <user_agent>  optional, browser user agent
  -w, --wait <millisecond>  optional, waitfor n milliseconds
  -p, --path <binary_path>  optional, path to chrome/chromium binary
                            default "/usr/bin/chromium"
  -c, --cmd <cmd1,cmd2...>  optional, one or multiple commands:
                            ["html", "screenshot", "cookie", "header"]
                            default "html"
  -s, --show                optional, show browser
                            default not show
  -h, --help                display help for command
```

## Function

- Take screenshot: `-c screenshot`, take screenshot of whole page

- Fetch HTML: `-c html`, dump <html> tag as output text

- Fetch cookie: `-c cookie`, dump site cookie as output json

- Fetch response header: `-c header`, dump response header as output json
