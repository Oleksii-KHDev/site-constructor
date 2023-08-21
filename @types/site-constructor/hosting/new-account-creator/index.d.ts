import type { email } from 'site-constructor';

declare module 'site-constructor/hosting/new-account-creator' {
  export interface IHostingAccountCreator {
    _registrationOptions?: IRegistrationOptions | undefined;
    getRegistrationOptions: () => IRegistrationOptions | undefined;

    setRegistrationOptions: (value: RegistrationOptions) => void;
    register: (options?: IRegistrationOptions) => IHostingAccount;
  }

  export interface IRegistrationOptions {
    email?: email;
  }
}
