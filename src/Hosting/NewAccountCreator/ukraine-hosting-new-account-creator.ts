import { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import type { IRegistrationOptions } from 'site-constructor/hosting/new-account-creator';
import type { IHostingAccount } from 'site-constructor/hosting';
import { injectable } from 'inversify';

@injectable()
export class UkraineHostingNewAccountCreator implements IHostingAccountCreator {
  _registrationOptions?: IRegistrationOptions | undefined;

  getRegistrationOptions(): IRegistrationOptions | undefined {
    return this._registrationOptions;
  }

  setRegistrationOptions(value: IRegistrationOptions) {
    this._registrationOptions = value;
  }

  constructor(registrationOptions: IRegistrationOptions = {}) {
    this._registrationOptions = registrationOptions;
  }

  public register(registrationOptions?: IRegistrationOptions): IHostingAccount {
    if (registrationOptions) {
      this.setRegistrationOptions(registrationOptions);
    }

    return {
      login: this.getRegistrationOptions()?.email ?? '',
      email: this.getRegistrationOptions()?.email ?? '',
      creatorClassName: this.constructor.name,
    };
  }
}
