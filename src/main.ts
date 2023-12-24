import type { IHostingFactory, IHostingAccount } from 'site-constructor/hosting';
import type { email, hostingUrl } from 'site-constructor';
import container from './config/ioc_config';
import SERVICE_IDENTIFIER from './constants/identifiers';
import TAG from './constants/tags';

/**
 * Popup after successful registration
 * <div class="top right ui toast-container  "></div>
 */

const email: email = 'yapew35657@anomgo.com';
const hostingUrl: hostingUrl = 'https://www.ukraine.com.ua/';
const ukraineHostingFactory: IHostingFactory = container.getNamed<IHostingFactory>(
  SERVICE_IDENTIFIER.HOSTING_FACTORY,
  TAG.UKRAINE_HOSTING_FACTORY,
);
const hosting = ukraineHostingFactory.createHosting({ email, hostingUrl });
const account: IHostingAccount = hosting.createNewAccount();
