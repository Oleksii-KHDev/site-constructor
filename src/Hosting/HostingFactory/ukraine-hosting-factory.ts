import type { IHostingFactory, IHostingOptions } from 'site-constructor/hosting';
import { inject, injectable } from 'inversify';
import { Hosting } from '../hosting';
import SERVICE_IDENTIFIER from '../../constants/identifiers';
import TAG from '../../constants/tags';

@injectable()
export class UkraineHostingFactory implements IHostingFactory {
  private readonly _hostingFactory: (options: IHostingOptions) => Hosting;
  constructor(
    @inject(SERVICE_IDENTIFIER.HOSTING_FACTORY) hostingFactory: (type: string) => (options: IHostingOptions) => Hosting,
  ) {
    this._hostingFactory = hostingFactory(TAG.UKRAINE_HOSTING);
  }

  public createHosting(options: IHostingOptions): Hosting {
    return this._hostingFactory(options);
  }
}
