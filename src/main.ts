import type { IHostingFactory } from 'site-constructor/hosting';
import { Hosting } from './Hosting';
import type { email } from 'site-constructor';
import container from './config/ioc_config';
import { interfaces } from 'inversify';
import SERVICE_IDENTIFIER from './constants/identifiers';
import TAG from './constants/tags';

/**
 * Popup after successful registration
 * <div class="top right ui toast-container  "></div>
 */

const email: email = 'yapew35657@anomgo.com';
const ukraineHostingFactory: IHostingFactory = container.get<IHostingFactory>(
  SERVICE_IDENTIFIER.UKRAINE_HOSTING_FACTORY,
);
const hosting = ukraineHostingFactory.createHosting({ email });
hosting.createNewAccount();
