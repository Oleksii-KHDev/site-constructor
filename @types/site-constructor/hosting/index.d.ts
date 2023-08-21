import type { email, login } from 'site-constructor';
import type { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';

declare module 'site-constructor/hosting' {
  export interface IHosting {
    _options?: IHostingOptions | undefined;

    getOptions: () => IHostingOptions | undefined;

    setOptions: (value: IHostingOptions) => void;

    readonly _accountCreator?: IHostingAccountCreator;

    createNewAccount: () => void;
  }

  export interface IHostingFactory {
    createHosting: (options: IHostingOptions) => Ihosting;
  }

  export interface IHostingOptions {
    email?: email;
  }

  export interface IHostingAccount {
    login: login;
    email: email;
    creatorClassName?: string;
  }
}
