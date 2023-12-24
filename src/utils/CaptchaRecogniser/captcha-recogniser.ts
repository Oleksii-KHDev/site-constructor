import 'reflect-metadata';
import type { Worker } from 'tesseract.js';
import type { ICaptchaRecogniser, CaptchaElement, CaptchaSolvingResult } from 'site-constructor';
import { createWorker } from 'tesseract.js';
import { injectable } from 'inversify';
import { ElementHandle, NodeFor, Page } from 'puppeteer';
import { CAPTCHA_IMAGE_FILE_NAME, REGISTRATION_CAPTCHA_IMAGE_SELECTOR } from '../../constants';
import { convertImageSourceToUint8Array, saveUint8ArrayImageToDisk } from '../image';
import { HttpDetailedError } from '../errors/HttpDetailedError/http-detailed-error.class';
import { CANT_GET_CAPTCHA_IMAGE_SRC_ERROR, CANT_SAVE_CAPTCHA_IMAGE_TO_DISK_ERROR } from '../../constants';
import * as errors from '../../constants/errors';

@injectable()
export class CaptchaRecogniser implements ICaptchaRecogniser {
  private worker?: Worker;
  async initializeEnvironment(options?: any) {
    this.worker = await createWorker();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
  }

  async destroyEnvironment() {
    await this.worker?.terminate();
  }

  async recogniseCaptchaText(imagePath: string): Promise<string> {
    if (!this.worker) {
      throw new Error('The environment has not been initialized. Please run first initializeEnvironment method.');
    }

    return (await this.worker.recognize('captcha.png')).data.text;
  }

  async isCaptchaPresentOnThePage(page: Page): Promise<boolean> {
    const captchaElement = await this.getCaptchaElementFromThePage(page);
    return !!captchaElement;
  }

  async getCaptchaElementFromThePage(
    page: Page,
  ): Promise<ElementHandle<NodeFor<typeof REGISTRATION_CAPTCHA_IMAGE_SELECTOR>> | null> {
    return page.$(REGISTRATION_CAPTCHA_IMAGE_SELECTOR);
  }

  async solveCaptcha(element: CaptchaElement): Promise<CaptchaSolvingResult> {
    const captchaFileName: string = CAPTCHA_IMAGE_FILE_NAME;
    const src = await (await element.getProperty('src')).jsonValue();

    if (!src || typeof src !== 'string') {
      throw new HttpDetailedError(CANT_GET_CAPTCHA_IMAGE_SRC_ERROR);
    }

    if (!(await saveUint8ArrayImageToDisk(captchaFileName, convertImageSourceToUint8Array(src)))) {
      throw new HttpDetailedError(CANT_SAVE_CAPTCHA_IMAGE_TO_DISK_ERROR);
    }

    await this.initializeEnvironment();
    const captchaText = (await this.recogniseCaptchaText(captchaFileName)).match(/\d/g)?.join('');

    /**
     * @TODO Restart recognition process if length of the captcha text less than 6 digits
     */

    if (!captchaText) {
      await this.destroyEnvironment();
      throw new HttpDetailedError(errors.CAPTCHA_TEXT_NOT_RECOGNIZED_ERROR);
    }

    await this.destroyEnvironment();
    return { status: 'ok', text: captchaText };
  }
}
