import type { IHostingFactory, IHostingOptions, IHosting } from 'site-constructor/hosting';
import { inject, injectable } from 'inversify';
import SERVICE_IDENTIFIER from '../../constants/identifiers';
import TAG from '../../constants/tags';

@injectable()
export class UkraineHostingFactory implements IHostingFactory {
  private readonly _hostingFactory: (options: IHostingOptions) => IHosting;
  constructor(
    @inject(SERVICE_IDENTIFIER.HOSTING_FACTORY)
    hostingFactory: (type: string) => (options: IHostingOptions) => IHosting,
  ) {
    this._hostingFactory = hostingFactory(TAG.UKRAINE_HOSTING);
  }

  public createHosting(options: IHostingOptions): IHosting {
    return this._hostingFactory(options);
  }
}
