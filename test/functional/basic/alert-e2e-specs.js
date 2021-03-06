import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import B from 'bluebird';
import { UICATALOG_CAPS } from '../desired';
import { initSession, deleteSession, MOCHA_TIMEOUT } from '../helpers/session';


chai.should();
chai.use(chaiAsPromised);

describe('XCUITestDriver - alerts', function () {
  this.timeout(MOCHA_TIMEOUT);

  let driver;
  before(async () => {
    driver = await initSession(UICATALOG_CAPS);
  });
  after(async () => {
    await deleteSession();
  });


  beforeEach(async () => {
    let el1 = await driver.elementByAccessibilityId('Alert Views');
    await el1.click();
  });
  afterEach(async () => {
    await driver.back();
  });

  it('should detect Simple', async () => {
    let el = await driver.elementByAccessibilityId('Simple');
    await el.click();
    await B.delay(2000);

    (await driver.alertText()).should.include('A Short Title Is Best');
    await driver.dismissAlert();
  });

  it('should detect Okay', async () => {
    let el = await driver.elementByAccessibilityId('Okay / Cancel');
    await el.click();

    // small pause for alert to open
    await B.delay(1000);

    (await driver.alertText()).should.include('A Short Title Is Best');
    await driver.acceptAlert();
  });

  it('should detect Other', async () => {
    let el = await driver.elementByAccessibilityId('Other');
    await el.click();

    // small pause for alert to open
    await B.delay(1000);

    (await driver.alertText()).should.include('A Short Title Is Best');
    await driver.dismissAlert();
  });

  it('should be able to interact with text field', async () => {
    let el = await driver.elementByAccessibilityId('Text Entry');
    await el.click();

    // small pause for alert to open
    await B.delay(1000);

    let textField = await driver.elementByClassName('XCUIElementTypeTextField');
    await textField.type('hello world');

    let text = await textField.text();
    text.should.equal('hello world');

    await driver.dismissAlert();
  });

  it('should throw a NoAlertOpenError when no alert is open', async () => {
    await driver.acceptAlert()
      .should.be.rejectedWith(/An attempt was made to operate on a modal dialog when one was not open/);
  });
});
