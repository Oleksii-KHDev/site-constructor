import type { email, login } from 'site-constructor';
import type { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import type { INewHostingOptions } from 'site-constructor/hosting';

declare module 'site-constructor/hosting' {
  export interface IHosting {
    createNewAccount: () => void;
  }

  export interface INewHostingOptions {
    email?: email;
    accountCreator?: IHostingAccountCreator;
  }

  export interface IHostingAccount {
    login: login;
    email: email;
  }

  export abstract class Hosting implements IHosting {
    protected options: INewHostingOptions;

    protected constructor(options: INewHostingOptions = {}) {
      this.options = options;
    }

    abstract createNewAccount(): void;
  }
}
