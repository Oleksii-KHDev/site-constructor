import { ElementHandle, NodeFor, Page } from 'puppeteer';
import { REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR } from '../../src/constants';

declare module 'site-constructor' {
  export type email = string;
  export type login = string;
  export type hostingUrl = string;
  export type status = 'ok' | 'error';
  export type captchaSolvingStatus = status | 'skipped';

  export interface ICaptchaRecogniser {
    recogniseCaptchaText: (imagePath: string) => Promise<string>;
    initializeEnvironment: (options?: any) => Promise<void>;
    destroyEnvironment: () => Promise<void>;
    isCaptchaPresentOnThePage: (page: Page) => Promise<boolean>;
    getCaptchaElementFromThePage: (page: Page) => Promise<ElementHandle<NodeFor<string>> | null>;
    solveCaptcha: (element: CaptchaElement) => Promise<CaptchaSolvingResult>;
  }
  export interface CaptchaSolvingResult {
    text?: string; // text from the captcha
    status: captchaSolvingStatus; // solving process status
    message?: string; // error message
  }

  export type CaptchaElement = ElementHandle<NodeFor<typeof REGISTRATION_CAPTCHA_TEXT_INPUT_SELECTOR>>;
}
