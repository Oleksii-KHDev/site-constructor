import type { email, hostingUrl } from 'site-constructor';
import type { IHostingAccount } from 'site-constructor/hosting';
import { Browser } from 'puppeteer';

declare module 'site-constructor/hosting/new-account-creator' {
  export interface IHostingAccountCreator {
    register: (options?: IRegistrationOptions, defaultBrowser?: Browser) => Promise<IHostingAccount>;
  }

  export interface IRegistrationOptions {
    email?: email;
    hostingUrl?: hostingUrl;
  }
}
