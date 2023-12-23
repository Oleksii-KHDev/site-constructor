import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import SERVICE_IDENTIFIER from '../constants/identifiers';
import TAG from '../constants/tags';
import type { IHostingOptions, IHostingFactory, IHosting } from 'site-constructor/hosting';
import { UkraineHosting } from '../Hosting';
import type { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import type { ICaptchaRecogniser } from 'site-constructor';
import { UkraineHostingFactory } from '../Hosting/HostingFactory/ukraine-hosting-factory';
import { UkraineHostingNewAccountCreator } from '../Hosting/NewAccountCreator';
import { CaptchaRecogniser } from '../utils';
import UkraineHostingTwoFactorAuthentication from '../Hosting/TwoFactorAuthentication/UkraineHostingTwoFactorAuthentication/UkraineHostingTwoFactorAuthentication';
import type { ITwoFactorAuthentication } from 'site-constructor/hosting/two-factor-authentication';
import puppeteer, { Browser } from 'puppeteer';

const container = new Container();

container.bind<IHostingFactory>(SERVICE_IDENTIFIER.UKRAINE_HOSTING_FACTORY).to(UkraineHostingFactory);

container
  .bind<IHostingAccountCreator>(SERVICE_IDENTIFIER.NEW_ACCOUNT_CREATOR)
  .to(UkraineHostingNewAccountCreator)
  .whenParentNamed(TAG.UKRAINE_HOSTING);

container
  .bind<ITwoFactorAuthentication>(SERVICE_IDENTIFIER.TWO_FACTOR_AUTHENTICATION_SERVICE)
  .to(UkraineHostingTwoFactorAuthentication)
  .whenParentNamed(TAG.UKRAINE_HOSTING);

container.bind<ICaptchaRecogniser>(SERVICE_IDENTIFIER.CAPTCHA_RECOGNISER).to(CaptchaRecogniser);

container
  .bind<interfaces.Factory<IHosting>>(SERVICE_IDENTIFIER.HOSTING_FACTORY)
  .toFactory<Promise<IHosting>, [string], [IHostingOptions]>((context: interfaces.Context) => {
    return (type: string) => async (options: IHostingOptions) => {
      const hosting = context.container.getNamed<IHosting>(SERVICE_IDENTIFIER.HOSTING, type);
      await hosting.setOptions(options);
      return hosting;
    };
  });

container.bind<IHosting>(SERVICE_IDENTIFIER.HOSTING).to(UkraineHosting).whenTargetNamed(TAG.UKRAINE_HOSTING);

// PUPPETEER BROWSER
container.bind<Promise<Browser>>(SERVICE_IDENTIFIER.BROWSER).toConstantValue(
  puppeteer.launch({
    headless: true,
    env: {
      DISPLAY: ':10.0',
    },
  }),
);

export default container;
