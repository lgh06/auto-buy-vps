const chromeLauncher = require('chrome-launcher');

let fun = chrome => {
  console.log(`Chrome debuggable on port: ${chrome.port}`);
  let CDP = require('chrome-remote-interface');


  CDP((client) => {
    // extract domains
    const {Network, Page} = client;
    // setup handlers
    Network.requestWillBeSent((params) => {
      console.log(params.request.url);
    });
    Page.loadEventFired(() => {
      client.close();
    });
    // enable events then start!
    Promise.all([
      Network.enable(),
      Page.enable()
    ]).then(() => {
      return Page.navigate({url: 'https://github.com'});
    }).catch((err) => {
      console.error(err);
      client.close();
    });
  }).on('error', (err) => {
    // cannot connect to the remote endpoint
    console.error(err);
  });

  // chrome.kill();
}

chromeLauncher.launch({
  startingUrl: 'https://www.baidu.com',
  chromeFlags: [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--disable-web-security',
    '--allow-file-access-from-files',
    //'--user-data-dir="/tmp/chrome_dev_session"'
  ]
}).then(fun, fun);
