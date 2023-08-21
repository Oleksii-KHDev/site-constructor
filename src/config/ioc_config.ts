import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import SERVICE_IDENTIFIER from '../constants/identifiers';
import TAG from '../constants/tags';
import type { IHostingOptions, IHostingFactory, IHosting } from 'site-constructor/hosting';
import { UkraineHosting } from '../Hosting';
import type { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import { UkraineHostingFactory } from '../Hosting/HostingFactory/ukraine-hosting-factory';
import { UkraineHostingNewAccountCreator } from '../Hosting/NewAccountCreator';

const container = new Container();

container.bind<IHostingFactory>(SERVICE_IDENTIFIER.UKRAINE_HOSTING_FACTORY).to(UkraineHostingFactory);
container
  .bind<IHostingAccountCreator>(SERVICE_IDENTIFIER.NEW_ACCOUNT_CREATOR)
  .to(UkraineHostingNewAccountCreator)
  .whenParentNamed(TAG.UKRAINE_HOSTING);
container
  .bind<interfaces.Factory<IHosting>>(SERVICE_IDENTIFIER.HOSTING_FACTORY)
  .toFactory<IHosting, [string], [IHostingOptions]>((context: interfaces.Context) => {
    return (type: string) => (options: IHostingOptions) => {
      const hosting = context.container.getNamed<IHosting>(SERVICE_IDENTIFIER.HOSTING, type);
      hosting.setOptions(options);
      return hosting;
    };
  });

container.bind<IHosting>(SERVICE_IDENTIFIER.HOSTING).to(UkraineHosting).whenTargetNamed(TAG.UKRAINE_HOSTING);

export default container;
