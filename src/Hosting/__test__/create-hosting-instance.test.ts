import { email } from 'site-constructor';
import container from '../../config/ioc_config';
import SERVICE_IDENTIFIER from '../../constants/identifiers';
import type { IHostingAccount, IHostingFactory } from 'site-constructor/hosting';
import { UkraineHostingNewAccountCreator } from '../NewAccountCreator';
import UkraineHostingTwoFactorAuthentication from '../TwoFactorAuthentication/UkraineHostingTwoFactorAuthentication/UkraineHostingTwoFactorAuthentication';

describe('Test creation of new Hosting instance', () => {
  test('Should get Ukraine hosting instance from Inversify container', async () => {
    const email: email = 'yapew35657@anomgo.com';
    const hostingUrl = 'https://www.ukraine.com.ua/';
    const ukraineHostingFactory: IHostingFactory = await container.getAsync(SERVICE_IDENTIFIER.UKRAINE_HOSTING_FACTORY);
    const hosting = await ukraineHostingFactory.createHosting({ email, hostingUrl });
    expect(hosting._twoFactorAutService).toBeInstanceOf(UkraineHostingTwoFactorAuthentication);
    expect(hosting._accountCreator).toBeInstanceOf(UkraineHostingNewAccountCreator);
    jest
      .spyOn(UkraineHostingNewAccountCreator.prototype, 'register')
      .mockResolvedValue({ login: email, email, hostingUrl });
    const account: IHostingAccount = await hosting.createNewAccount();
    expect(account).toBeDefined();
    expect(account).not.toBeNull();
    expect(account.email).toEqual(email);
    expect(account.login).toEqual(email);
    expect(account.hostingUrl).toEqual(hostingUrl);
  });
});
