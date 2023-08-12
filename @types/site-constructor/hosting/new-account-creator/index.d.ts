import type { IHostingAccount } from 'site-constructor/hosting';
import type { email } from 'site-constructor';

declare module 'site-constructor/hosting/new-account-creator' {
  export interface IHostingAccountCreator {
    register: () => IHostingAccount;
  }

  export interface RegistrationOptions {
    email?: email;
  }

  export abstract class NewAccountCreator implements IHostingAccountCreator {
    protected registrationOptions: RegistrationOptions;

    protected constructor(registrationOptions: RegistrationOptions = {}) {
      this.registrationOptions = registrationOptions;
    }

    abstract register(): IHostingAccount;
  }
}
