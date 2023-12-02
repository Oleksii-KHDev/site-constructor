import 'reflect-metadata';
import container from '../../../config/ioc_config';
import SERVICE_IDENTIFIER from '../../../constants/identifiers';
import type { IHostingAccount, IHostingFactory, IHostingOptions } from 'site-constructor/hosting';
import { Browser } from 'puppeteer';

const EMAIL = 'segehot343@dpsols.com';
const HOSTING_URL = 'https://www.ukraine.com.ua/';

if (typeof require !== 'undefined' && require.main === module)
  (async function () {
    [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
      process.on(eventType, (signal) => {
        console.log(`Received ${signal}. Force closing the Puppeteer Browse`);
        const browser: Browser = container.get(SERVICE_IDENTIFIER.BROWSER);
        browser.close().then(() => console.log('Puppeteer Browser has closed'));
      });
    });

    const ukraineHostingFactory: IHostingFactory = await container.getAsync(SERVICE_IDENTIFIER.UKRAINE_HOSTING_FACTORY);
    const hosting = await ukraineHostingFactory.createHosting({
      email: EMAIL,
      hostingUrl: HOSTING_URL,
    } as IHostingOptions);
    const account: IHostingAccount = await hosting.createNewAccount();
    console.dir(account, { depth: null, colors: true });
  })();
