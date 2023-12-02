import 'reflect-metadata';
import { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import type { IRegistrationOptions } from 'site-constructor/hosting/new-account-creator';
import type { IHostingAccount } from 'site-constructor/hosting';
import type { ICaptchaRecogniser, CaptchaSolvingResult } from 'site-constructor';
import { inject, injectable } from 'inversify';
import { Browser } from 'puppeteer';
import {
  convertImageSourceToUint8Array,
  delay,
  DtoValidator,
  saveUint8ArrayImageToDisk,
  waitForVisibleElementOrThrowError,
} from '../../utils';
import SERVICE_IDENTIFIER from '../../constants/identifiers';
import * as UKRAINE_HOSTING_SETTINGS from '../../constants/ukraine-hosting';
import * as errors from '../../constants/errors';
import { CAPTCHA_IMAGE_FILE_NAME } from '../../constants';
import { IValidationResult } from 'site-constructor/validation';
import { HostingAccountOptionsDto } from './Dto/new-account-options.dto';
import { HttpDetailedError } from '../../utils/errors/HttpDetailedError/http-detailed-error.class';
import container from '../../config/ioc_config';

@injectable()
export class UkraineHostingNewAccountCreator implements IHostingAccountCreator {
  @inject(SERVICE_IDENTIFIER.CAPTCHA_RECOGNISER)
  private readonly _captchaRecogniser?: ICaptchaRecogniser;

  private async recogniseTextFromCaptchaImage(imagePath: string): Promise<string | undefined> {
    await this._captchaRecogniser?.initializeEnvironment();
    const captchaText = (await this._captchaRecogniser!.recogniseCaptchaText(imagePath)).match(/\d/g)?.join('');
    await this._captchaRecogniser?.destroyEnvironment();
    return captchaText;
  }

  public async register(registrationOptions?: IRegistrationOptions): Promise<IHostingAccount> {
    /**
     * @TODO Polish and verify registration process
     */
    if (!registrationOptions) {
      throw new HttpDetailedError(errors.INVALID_REGISTRATION_OPTIONS_ERROR);
    }

    if (!this._captchaRecogniser) {
      throw new HttpDetailedError(errors.USING_CAPTCHA_RECOGNISER_SERVICE_ERROR);
    }

    const validationResult: IValidationResult = await new DtoValidator(HostingAccountOptionsDto).validate(
      registrationOptions,
    );

    if (validationResult.status === 'error') {
      const validationError = new HttpDetailedError(errors.INVALID_REGISTRATION_OPTIONS_ERROR);
      validationError.setMeta('validationMessage', validationResult.message);
      throw validationError;
    }

    const browser: Browser = await container.getAsync(SERVICE_IDENTIFIER.BROWSER);

    const pages = await browser.pages();
    const page = pages.length === 1 ? pages[0] : await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });
    await page.goto(registrationOptions!.hostingUrl!);

    await waitForVisibleElementOrThrowError(page, UKRAINE_HOSTING_SETTINGS.REGISTRATION_LINK_SELECTOR);
    await page.click(UKRAINE_HOSTING_SETTINGS.REGISTRATION_LINK_SELECTOR);

    await waitForVisibleElementOrThrowError(page, UKRAINE_HOSTING_SETTINGS.REGISTRATION_INPUT_EMAIL_FIELD_SELECTOR);
    await page.type(UKRAINE_HOSTING_SETTINGS.REGISTRATION_INPUT_EMAIL_FIELD_SELECTOR, registrationOptions!.email!);
    await delay(2000);

    let captchaElement = await this._captchaRecogniser?.getCaptchaElementFromThePage(page);

    if (captchaElement) {
      const captchaSolvingResult = await this._captchaRecogniser?.solveCaptcha(captchaElement);
      await delay(2000);
      await waitForVisibleElementOrThrowError(page, UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR);
      await page.type(
        UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR,
        captchaSolvingResult.text! as string,
      );
    }

    const registerButton = await waitForVisibleElementOrThrowError(
      page,
      UKRAINE_HOSTING_SETTINGS.REGISTRATION_BUTTON_SELECTOR,
    );
    await registerButton.evaluate((button) => button.click());
    await delay(2000);

    captchaElement = await page.$(UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_IMAGE_SELECTOR);

    if (captchaElement) {
      const captchaSolvingResult = await this._captchaRecogniser?.solveCaptcha(captchaElement);
      await delay(2000);
      await waitForVisibleElementOrThrowError(page, UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR);
      await page.type(
        UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR,
        captchaSolvingResult.text! as string,
      );
      await delay(2000);
      await registerButton.evaluate((button) => button.click());
    }

    /**
     * @TODO Check if registration was successful
     */
    return {
      login: registrationOptions!.email!,
      email: registrationOptions.email!,
      hostingUrl: registrationOptions.hostingUrl ?? '',
    };
  }
}
