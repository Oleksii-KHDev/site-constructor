import type { email, hostingUrl } from 'site-constructor';
import type { IHostingAccount } from 'site-constructor/hosting';

declare module 'site-constructor/hosting/new-account-creator' {
  export interface IHostingAccountCreator {
    _registrationOptions?: IRegistrationOptions | undefined;
    getRegistrationOptions: () => IRegistrationOptions | undefined;

    setRegistrationOptions: (value: RegistrationOptions) => void;
    register: (options?: IRegistrationOptions) => Promise<IHostingAccount>;
  }

  export interface IRegistrationOptions {
    email?: email;
    hostingUrl?: hostingUrl;
  }
}
