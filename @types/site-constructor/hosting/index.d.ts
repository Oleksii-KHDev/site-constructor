import type { email, login } from 'site-constructor';
import type { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
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
}
