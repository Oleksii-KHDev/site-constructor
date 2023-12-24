import type { email, login, hostingUrl } from 'site-constructor';
import type { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import { Browser } from 'puppeteer';

declare module 'site-constructor/hosting' {
  export interface IHosting {
    _options?: IHostingOptions | undefined;

    getOptions: () => IHostingOptions | undefined;

    setOptions: (value: IHostingOptions) => void;

    readonly _accountCreator?: IHostingAccountCreator;

    /**
     * Create account
     */
    createNewAccount: () => void;

    /**
     * Enable two-factor authentication
     */
    enableTwoFactorAuthentication: () => void;
  }

  export interface IHostingFactory {
    createHosting: (options: IHostingOptions) => Ihosting;
  }

  export interface IHostingOptions {
    email?: email;
    hostingUrl?: hostingUrl;
    browser?: Browser;
  }

  export interface IHostingAccount {
    login: login;
    email: email;
    hostingUrl: hostingUrl;
  }
}
