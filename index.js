require('chromedriver');
var config = require('./config.json').digitalocean;
var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;

var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

var handleError = (e)=>console.log(e);

driver.get('https://cloud.digitalocean.com/login');
driver.findElement(By.id('user_email')).sendKeys(config.username);
driver.findElement(By.id('user_password')).sendKeys(config.password);
driver.findElement(By.name('commit')).click();

//有两步验证
driver.wait(until.elementLocated(By.id('otp')), 50000).then(()=>{
  driver.wait(function (){
    let v = driver.findElement(By.id('otp')).getAttribute("value");
    return v.then((v)=>{
      if(v && v.match(/[0-9a-zA-Z]{6,}/)){
        return Promise.resolve(true);
      }
    });
  }, 50000).catch(handleError);
  driver.sleep(3000); // two factor authentication
  var twoFactorBtn = driver.findElement(By.name('commit'));
  twoFactorBtn.click();

}).catch(handleError);

//无两步验证


//driver.sleep(900000);
driver.quit();
