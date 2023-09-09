import { Page } from 'puppeteer';
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
