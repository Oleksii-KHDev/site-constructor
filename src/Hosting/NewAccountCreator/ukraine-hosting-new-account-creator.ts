import 'reflect-metadata';
import { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import type { IRegistrationOptions } from 'site-constructor/hosting/new-account-creator';
import type { IHostingAccount } from 'site-constructor/hosting';
import type { ICaptchaRecogniser, CaptchaSolvingResult } from 'site-constructor';
import { inject, injectable } from 'inversify';
import { Browser, Page } from 'puppeteer';
import { delay, DtoValidator, waitForVisibleElementOrThrowError } from '../../utils';
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

  private async solveCaptchaIfPresent(page: Page): Promise<CaptchaSolvingResult> {
    const captchaElement = await page.$(UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_IMAGE_SELECTOR);

    if (captchaElement) {
      const captchaSolvingResult = await this._captchaRecogniser?.solveCaptcha(captchaElement);
      await delay(2000);
      await waitForVisibleElementOrThrowError(page, UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR);
      await page.type(
        UKRAINE_HOSTING_SETTINGS.REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR,
        captchaSolvingResult!.text as string,
      );
      return captchaSolvingResult!;
    }

    return { status: 'skipped' };
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

    const registerButton = await waitForVisibleElementOrThrowError(
      page,
      UKRAINE_HOSTING_SETTINGS.REGISTRATION_BUTTON_SELECTOR,
    );

    let solvingResult = await this.solveCaptchaIfPresent(page);

    await registerButton.evaluate((button) => button.click());
    await delay(2000);

    /**
     * Checks that the input was correct
     */

    solvingResult = await this.solveCaptchaIfPresent(page);
    if (solvingResult.status === 'ok') {
      await registerButton.evaluate((button) => button.click());
    }

    /**
     * @TODO Handle redirect to the login page
     */

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
