import createHttpError, { HttpError } from 'http-errors';
import type { IHttpDetailedError, HttpErrorDetailsObject, HttpErrorDetailsArray } from 'site-constructor/errors';

export class HttpDetailedError implements IHttpDetailedError {
  [key: string]: any;

  constructor(errorDetails: HttpErrorDetailsObject | HttpErrorDetailsArray) {
    const message = Array.isArray(errorDetails) ? errorDetails[1] : errorDetails.message;
    const statusCode = Array.isArray(errorDetails) ? errorDetails[0] : errorDetails.statusCode;
    const meta = Array.isArray(errorDetails) ? errorDetails[2] : errorDetails.meta;
    const httpError = createHttpError(statusCode as number, message, meta);

    Object.setPrototypeOf(this, HttpError.prototype);
    Object.assign(this, httpError);
    Object.assign(this.constructor.prototype, httpError.constructor.prototype);
    Object.defineProperty(this, 'name', {
      enumerable: false,
      configurable: true,
      value: HttpDetailedError.name,
      writable: true,
    });
    Object.defineProperty(this.constructor.prototype, 'setMeta', {
      enumerable: false,
      configurable: true,
      value: HttpDetailedError.prototype.setMeta,
      writable: true,
    });
    Object.defineProperty(this.constructor.prototype, 'getMeta', {
      enumerable: false,
      configurable: true,
      value: HttpDetailedError.prototype.getMeta,
      writable: true,
    });
    Error.captureStackTrace(this, HttpDetailedError);
  }

  getMeta(name: string): any {
    return this[name];
  }

  setMeta(name: string, value: any): void {
    this[name] = value;
  }
}
