import 'reflect-metadata';
import type { ITwoFactorAuthentication } from 'site-constructor/hosting/two-factor-authentication';
import { injectable } from 'inversify';
import type { IHostingAccount } from 'site-constructor/hosting';
@injectable()
export default class UkraineHostingTwoFactorAuthentication implements ITwoFactorAuthentication {
  enable(account: IHostingAccount) {
    console.log('UkraineHostingTwoFactorAuthentication enable');
  }
}
