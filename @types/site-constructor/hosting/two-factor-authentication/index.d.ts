import { IHostingAccount } from 'site-constructor/hosting';

declare module 'site-constructor/hosting/two-factor-authentication' {
  export interface ITwoFactorAuthentication {
    enable: (account: IHostingAccount) => void;
  }
}
