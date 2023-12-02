import { ElementHandle, NodeFor, Page } from 'puppeteer';
import { HttpDetailedError } from '../errors/HttpDetailedError/http-detailed-error.class';
import { CANT_FIND_NECESSARY_SELECTOR } from '../../constants';
export const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const takePageScreenShot = async (page: Page, fileName: string) => {
  await page.screenshot({
    path: fileName,
    fullPage: true,
    optimizeForSpeed: true,
    captureBeyondViewport: true,
    type: 'jpeg',
  });
};

export const waitForVisibleElementOrThrowError = async <Selector extends string>(
  page: Page,
  selector: Selector,
  timeout = 5000,
): Promise<ElementHandle<NodeFor<Selector>>> => {
  try {
    const element = await page.waitForSelector(selector, { timeout, hidden: false });
    return element as ElementHandle<NodeFor<Selector>>;
  } catch (e) {
    console.error(e);
    throw new HttpDetailedError([
      500,
      `Can't find ${selector} on the page`,
      { errorCode: CANT_FIND_NECESSARY_SELECTOR },
    ]);
  }
};
