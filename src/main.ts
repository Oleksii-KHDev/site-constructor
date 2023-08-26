import type { IHostingFactory, IHostingAccount } from 'site-constructor/hosting';
import type { email, hostingUrl } from 'site-constructor';
import container from './config/ioc_config';
import SERVICE_IDENTIFIER from './constants/identifiers';

/**
 * Popup after successful registration
 * <div class="top right ui toast-container  "></div>
 */

const email: email = 'yapew35657@anomgo.com';
const hostingUrl: hostingUrl = 'https://www.ukraine.com.ua/';
const ukraineHostingFactory: IHostingFactory = container.get(SERVICE_IDENTIFIER.UKRAINE_HOSTING_FACTORY);
const hosting = ukraineHostingFactory.createHosting({ email, hostingUrl });
const account: IHostingAccount = hosting.createNewAccount();
