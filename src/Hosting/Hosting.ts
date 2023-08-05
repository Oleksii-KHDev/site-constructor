import {INewHostingOptions} from "site-constructor/hosting"

export class Hosting {
  protected options: INewHostingOptions;

  constructor(options: INewHostingOptions = {}) {
    this.options = options;
  }
}
