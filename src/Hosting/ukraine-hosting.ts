import type { INewHostingOptions } from 'site-constructor/hosting';
import { Hosting } from 'site-constructor/hosting';

export class UkraineHosting extends Hosting {
  constructor(options: INewHostingOptions = {}) {
    super(options);
  }

  public createNewAccount() {
    this.options.accountCreator!.register();
  }
}
