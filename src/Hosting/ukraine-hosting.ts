import { Hosting } from './hosting';
import type { IHosting, INewHostingOptions } from 'site-constructor/hosting';

export class UkraineHosting extends Hosting implements IHosting {
  constructor(options: INewHostingOptions = {}) {
    super(options);
  }

  public createNewAccount() {
    this.options.accountCreator!.register();
  }
}
