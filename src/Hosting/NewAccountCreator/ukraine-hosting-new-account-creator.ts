import { NewAccountCreator } from './NewAccountCreator';
import type { RegistrationOptions, IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import type { IHostingAccount } from 'site-constructor/hosting';

export class UkraineHostingNewAccountCreator extends NewAccountCreator implements IHostingAccountCreator {
  constructor(registrationOptions: RegistrationOptions = {}) {
    super(registrationOptions);
  }

  public register(): IHostingAccount {
    return {
      login: this.registrationOptions.email ?? '',
      email: this.registrationOptions.email ?? '',
    };
  }
}
