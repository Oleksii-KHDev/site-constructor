import { NewAccountCreator } from 'site-constructor/hosting/new-account-creator';
import type { RegistrationOptions, IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import type { IHostingAccount } from 'site-constructor/hosting';

export class UkraineHostingNewAccountCreator extends NewAccountCreator {
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
