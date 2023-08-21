import type { IHostingOptions, IHosting, IHostingAccount } from 'site-constructor/hosting';
import type { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';

export abstract class Hosting implements IHosting {
  readonly _accountCreator?: IHostingAccountCreator;

  get accountCreator(): IHostingAccountCreator | undefined {
    return this._accountCreator;
  }

  _options?: IHostingOptions;

  getOptions(): IHostingOptions | undefined {
    return this._options;
  }

  setOptions(value: IHostingOptions) {
    this._options = value;
  }

  protected constructor(options: IHostingOptions = {}) {
    this._options = options;
  }

  abstract createNewAccount(): IHostingAccount;
}
