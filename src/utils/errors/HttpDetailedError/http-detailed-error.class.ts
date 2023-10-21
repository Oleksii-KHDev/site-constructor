import { HttpError } from 'http-errors';
import type { IHttpDetailedError, HttpErrorDetailsObject, HttpErrorDetailsArray } from 'site-constructor/errors';

export class HttpDetailedError extends HttpError implements IHttpDetailedError {
  constructor(errorDetails: HttpErrorDetailsObject | HttpErrorDetailsArray) {
    const message = Array.isArray(errorDetails) ? errorDetails[1] : errorDetails.message;
    super(message);

    const statusCode = Array.isArray(errorDetails) ? errorDetails[0] : errorDetails.status;

    if (statusCode) {
      this.statusCode = statusCode;
    }

    const meta = Array.isArray(errorDetails) ? errorDetails[2] : errorDetails.meta;

    if (meta && typeof meta === 'object' && Object.keys(meta).length > 0) {
      Object.assign(this, meta);
    }
  }

  getMeta(name: string): any {
    return this[name];
  }

  setMeta(name: string, value: any): void {
    this[name] = value;
  }
}
