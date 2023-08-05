import { UkraineHosting } from './Hosting/ukraine-hosting';
import { UkraineHostingNewAccountCreator } from './Hosting/NewAccountCreator/ukraine-hosting-new-account-creator';
import type { email } from 'site-constructor';

/**
 * Popup after successful registration
 * <div class="top right ui toast-container  "></div>
 */
const email: email = 'yapew35657@anomgo.com';
const accountCreator = new UkraineHostingNewAccountCreator({ email });
const hosting = new UkraineHosting({ accountCreator, email });
hosting.createNewAccount();
