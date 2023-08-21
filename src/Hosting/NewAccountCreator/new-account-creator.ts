import type { IHostingAccountCreator, IRegistrationOptions } from 'site-constructor/hosting/new-account-creator';
import type { IHostingAccount } from 'site-constructor/hosting';

export abstract class NewAccountCreator implements IHostingAccountCreator {
  _registrationOptions: IRegistrationOptions;
  getRegistrationOptions(): IRegistrationOptions | undefined {
    return this._registrationOptions;
  }

  setRegistrationOptions(value: IRegistrationOptions) {
    this._registrationOptions = value;
  }

  protected constructor(registrationOptions: IRegistrationOptions = {}) {
    this._registrationOptions = registrationOptions;
  }

  abstract register(registrationOptions?: IRegistrationOptions): IHostingAccount;
}
