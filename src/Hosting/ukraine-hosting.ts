import type { IHostingOptions, IHosting } from 'site-constructor/hosting';
import type { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import { injectable, inject, postConstruct } from 'inversify';
import SERVICE_IDENTIFIER from '../constants/identifiers';

@injectable()
export class UkraineHosting implements IHosting {
  @inject(SERVICE_IDENTIFIER.NEW_ACCOUNT_CREATOR)
  readonly _accountCreator?: IHostingAccountCreator;
  _options?: IHostingOptions | undefined;

  getOptions(): IHostingOptions | undefined {
    return this._options;
  }

  setOptions(value: IHostingOptions) {
    this._options = value;
  }

  get accountCreator(): IHostingAccountCreator | undefined {
    return this._accountCreator;
  }

  constructor(options: IHostingOptions = {}) {
    this._options = options;
  }

  public createNewAccount() {
    return this.accountCreator!.register({ email: this.getOptions()?.email });
  }
}
