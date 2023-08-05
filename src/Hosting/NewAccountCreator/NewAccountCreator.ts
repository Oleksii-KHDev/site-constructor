import { RegistrationOptions } from 'site-constructor/hosting/new-account-creator';

export class NewAccountCreator {
  protected registrationOptions: RegistrationOptions;

  constructor(registrationOptions: RegistrationOptions = {}) {
    this.registrationOptions = registrationOptions;
  }
}
