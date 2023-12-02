import type { IHostingFactory, IHostingOptions, IHosting } from 'site-constructor/hosting';
import { inject, injectable } from 'inversify';
import SERVICE_IDENTIFIER from '../../constants/identifiers';
import TAG from '../../constants/tags';

@injectable()
export class UkraineHostingFactory implements IHostingFactory {
  private readonly _hostingFactory: (options: IHostingOptions) => Promise<IHosting>;
  constructor(
    @inject(SERVICE_IDENTIFIER.HOSTING_FACTORY)
    hostingFactory: (type: string) => (options: IHostingOptions) => Promise<IHosting>,
  ) {
    this._hostingFactory = hostingFactory(TAG.UKRAINE_HOSTING);
  }

  public async createHosting(options: IHostingOptions): Promise<IHosting> {
    return this._hostingFactory(options);
  }
}
