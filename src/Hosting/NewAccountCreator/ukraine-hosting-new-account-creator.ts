import { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import type { IRegistrationOptions } from 'site-constructor/hosting/new-account-creator';
import type { IHostingAccount } from 'site-constructor/hosting';
import type { ICaptchaRecogniser } from 'site-constructor';
import { inject, injectable } from 'inversify';
import puppeteer from 'puppeteer';
import { convertImageSourceToUint8Array, delay, saveUint8ArrayImageToDisk } from '../../utils';
import SERVICE_IDENTIFIER from '../../constants/identifiers';
import * as UKRAINE_HOSTING_SETTINGS from '../../constants/ukraine-hosting';
import { CAPTCHA_IMAGE_FILE_NAME } from '../../constants';

@injectable()
export class UkraineHostingNewAccountCreator implements IHostingAccountCreator {
  @inject(SERVICE_IDENTIFIER.CAPTCHA_RECOGNISER)
  private readonly _captchaRecogniser?: ICaptchaRecogniser;
  _registrationOptions?: IRegistrationOptions | undefined;

  getRegistrationOptions(): IRegistrationOptions | undefined {
    return this._registrationOptions;
  }

  setRegistrationOptions(value: IRegistrationOptions) {
    this._registrationOptions = value;
  }

  constructor(registrationOptions: IRegistrationOptions = {}) {
    this._registrationOptions = registrationOptions;
  }

  private async recogniseTextFromCaptchaImage(imagePath: string): Promise<string | undefined> {
    if (!this._captchaRecogniser) {
      throw new Error('Error occurred while using captcha recogniser service');
    }

    await this._captchaRecogniser.initializeEnvironment();
    const captchaText = (await this._captchaRecogniser!.recogniseCaptchaText(imagePath)).match(/\d/g)?.join('');
    await this._captchaRecogniser.destroyEnvironment();
    return captchaText;
  }

  public async register(registrationOptions?: IRegistrationOptions): Promise<IHostingAccount> {
    if (registrationOptions) {
      this.setRegistrationOptions(registrationOptions);
    }

    /**
     * @TODO add validation of Registration options
     */

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    if (
      !this.getRegistrationOptions() ||
      !this.getRegistrationOptions()?.hostingUrl ||
      !this.getRegistrationOptions()?.email
    ) {
      throw new Error('There are no necessary registration options for creating new account');
    }

    await page.goto(this.getRegistrationOptions()!.hostingUrl!);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.click(UKRAINE_HOSTING_SETTINGS.REGISTRATION_LINK_SELECTOR);
    await page.type(
      UKRAINE_HOSTING_SETTINGS.REGISTRATION_INPUT_EMAIL_FIELD_SELECTOR,
      this.getRegistrationOptions()!.email!,
    );
    const registerButton = await page.waitForSelector(UKRAINE_HOSTING_SETTINGS.REGISTRATION_BUTTON_SELECTOR);

    if (!registerButton) {
      throw new Error("Can't find registration button on the page");
    }

    await registerButton.evaluate((button) => button.click());
    await delay(2000);
    const captchaImgEl = await page.$(UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_IMAGE_SELECTOR);

    if (captchaImgEl) {
      const captchaFileName: string = CAPTCHA_IMAGE_FILE_NAME;

      const src = await (await captchaImgEl.getProperty('src')).jsonValue();

      if (!(await saveUint8ArrayImageToDisk(captchaFileName, convertImageSourceToUint8Array(src)))) {
        throw new Error("Can't save captcha image to disk");
      }

      const captchaText = await this.recogniseTextFromCaptchaImage(captchaFileName);

      if (!captchaText) {
        throw new Error('Captcha text was not recognized successfully');
      }

      const inputCaptchaField = await page.waitForSelector(
        UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR,
      );

      if (inputCaptchaField) {
        throw new Error("Can't find captcha text input field");
      }
      await page.type(UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR, captchaText);
      await registerButton.evaluate((button) => button.click());

      /**
       * @TODO Validate that sign in successfully and enter hosting dashboard
       */
    }

    return {
      login: this.getRegistrationOptions()?.email ?? '',
      email: this.getRegistrationOptions()?.email ?? '',
      hostingUrl: this.getRegistrationOptions()?.hostingUrl ?? '',
      creatorClassName: this.constructor.name,
    };
  }
}
