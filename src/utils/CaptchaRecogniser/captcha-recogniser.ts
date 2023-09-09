import type { Worker } from 'tesseract.js';
import type { ICaptchaRecogniser } from 'site-constructor';
import { createWorker } from 'tesseract.js';
import { injectable } from 'inversify';

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
}
