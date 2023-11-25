import container from '../../config/ioc_config';
import SERVICE_IDENTIFIER from '../../constants/identifiers';
import { Browser } from 'puppeteer';
describe('Getting Puppeteer browser instance from the container', () => {
  it('Should return instance in singleton mode', async () => {
    const browser1: Browser = await container.getAsync(SERVICE_IDENTIFIER.BROWSER);
    expect(browser1).toBeInstanceOf(Browser);
    const browser2: Browser = await container.getAsync(SERVICE_IDENTIFIER.BROWSER);
    expect(browser2).toBeInstanceOf(Browser);
    expect(Object.is(browser1, browser2)).toEqual(true);
    await browser1.close();
    await browser2.close();
  });
});
