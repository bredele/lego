var Cloud = require('mocha-cloud');
var cloud = new Cloud('supplant', 'bredele', '13758bc9-784a-4340-846f-4c7d835da9bb');
// cloud.browser('Internet Explorer', '7', 'Windows XP');
// cloud.browser('Internet Explorer', '8', 'Windows XP');
cloud.browser('Internet Explorer', '9', 'Windows 7');
// cloud.browser('Opera', '12', 'Windows 7');
cloud.url('http://localhost:3000/test/');

cloud.on('init', function(browser){
  console.log('  init : %s %s', browser.browserName, browser.version);
});

cloud.on('start', function(browser){
  console.log('  start : %s %s', browser.browserName, browser.version);
});

cloud.on('end', function(browser, res){
  console.log('  end : %s %s : %d failures', browser.browserName, browser.version, res.failures);
});

cloud.start();