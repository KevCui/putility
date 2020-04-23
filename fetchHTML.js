// Usage:
//   phantomjs webScreenshot <url>

var system = require('system');
var args = system.args;
var url = args[1];

if (url === undefined) {
  console.log("[ERROR] Missing input <url>");
  phantom.exit();
}

var page = require('webpage').create();
var timestamp = Math.floor(Date.now() / 1000);
page.open(url, function(status) {
  if (status === "success") {
    var p = page.evaluate(function () {
      return document.getElementsByTagName('html')[0].innerHTML;
    });
    console.log(p);
  }
  phantom.exit();
});
