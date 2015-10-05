var webPage = require('webpage');
var page = webPage.create();

page.viewportSize = { width: 1024, height: 768 };
//the clipRect is the portion of the page you are taking a screenshot of
page.clipRect = { top: 0, left: 0, width: 1024, height: 768 };

page.open('https://www.adaptiveshop.se/', function(status) {
  console.log('Status: ' + status);
  page.render('screen.png');
  phantom.exit();
});