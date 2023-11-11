import 'reflect-metadata';
import { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import type { IRegistrationOptions } from 'site-constructor/hosting/new-account-creator';
import type { IHostingAccount } from 'site-constructor/hosting';
import type { ICaptchaRecogniser } from 'site-constructor';
import { inject, injectable } from 'inversify';
import puppeteer from 'puppeteer';
import { convertImageSourceToUint8Array, delay, DtoValidator, saveUint8ArrayImageToDisk } from '../../utils';
import SERVICE_IDENTIFIER from '../../constants/identifiers';
import * as UKRAINE_HOSTING_SETTINGS from '../../constants/ukraine-hosting';
import * as errors from '../../constants/errors';
import { CAPTCHA_IMAGE_FILE_NAME } from '../../constants';
import { IValidationResult } from 'site-constructor/validation';
import { HostingAccountOptionsDto } from './Dto/new-account-options.dto';
import { HttpDetailedError } from '../../utils/errors/HttpDetailedError/http-detailed-error.class';

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
      throw new HttpDetailedError(errors.USING_CAPTCHA_RECOGNISER_SERVICE_ERROR);
    }

    await this._captchaRecogniser.initializeEnvironment();
    const captchaText = (await this._captchaRecogniser!.recogniseCaptchaText(imagePath)).match(/\d/g)?.join('');
    await this._captchaRecogniser.destroyEnvironment();
    return captchaText;
  }

  public async register(registrationOptions?: IRegistrationOptions): Promise<IHostingAccount> {
    /**
     * @TODO Polish and verify registration process
     */
    if (!registrationOptions) {
      throw new HttpDetailedError(errors.INVALID_REGISTRATION_OPTIONS_ERROR);
    }

    const validationResult: IValidationResult = await new DtoValidator(HostingAccountOptionsDto).validate(
      registrationOptions,
    );

    if (validationResult.status === 'error') {
      const validationError = new HttpDetailedError(errors.INVALID_REGISTRATION_OPTIONS_ERROR);
      validationError.setMeta('validationMessage', validationResult.message);
      throw validationError;
    }

    this.setRegistrationOptions(registrationOptions);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(this.getRegistrationOptions()!.hostingUrl!);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.click(UKRAINE_HOSTING_SETTINGS.REGISTRATION_LINK_SELECTOR);
    await page.type(
      UKRAINE_HOSTING_SETTINGS.REGISTRATION_INPUT_EMAIL_FIELD_SELECTOR,
      this.getRegistrationOptions()!.email!,
    );
    const registerButton = await page.waitForSelector(UKRAINE_HOSTING_SETTINGS.REGISTRATION_BUTTON_SELECTOR);

    if (!registerButton) {
      throw new HttpDetailedError(errors.CANT_FIND_REGISTRATION_BUTTON_ERROR);
    }

    await registerButton.evaluate((button) => button.click());
    await delay(2000);
    const captchaImgEl = await page.$(UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_IMAGE_SELECTOR);

    if (captchaImgEl) {
      const captchaFileName: string = CAPTCHA_IMAGE_FILE_NAME;

      const src = await (await captchaImgEl.getProperty('src')).jsonValue();

      if (!(await saveUint8ArrayImageToDisk(captchaFileName, convertImageSourceToUint8Array(src)))) {
        throw new HttpDetailedError(errors.CANT_SAVE_CAPTCHA_IMAGE_TO_DISK_ERROR);
      }

      const captchaText = await this.recogniseTextFromCaptchaImage(captchaFileName);

      if (!captchaText) {
        throw new HttpDetailedError(errors.CAPTCHA_TEXT_NOT_RECOGNIZED_ERROR);
      }

      const inputCaptchaField = await page.waitForSelector(
        UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR,
      );

      if (inputCaptchaField) {
        throw new HttpDetailedError(errors.CANT_FIND_CAPTCHA_TEXT_INPUT_FIELD_ERROR);
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
    };
  }
}
