import type { IHostingOptions, IHosting } from 'site-constructor/hosting';
import type { IValidationResult } from 'site-constructor/validation';
import type { IHostingAccountCreator } from 'site-constructor/hosting/new-account-creator';
import { injectable, inject, postConstruct } from 'inversify';
import SERVICE_IDENTIFIER from '../../constants/identifiers';
import { DtoValidator } from '../../utils';
import { HostingOptionsDto } from '../Dto/hosting-options.dto';
import * as errors from '../../constants/errors';
import { HttpDetailedError } from '../../utils/errors/HttpDetailedError/http-detailed-error.class';
import type { ITwoFactorAuthentication } from 'site-constructor/hosting/two-factor-authentication';

@injectable()
export class UkraineHosting implements IHosting {
  @inject(SERVICE_IDENTIFIER.TWO_FACTOR_AUTHENTICATION_SERVICE)
  private readonly _twoFactorAutService: ITwoFactorAuthentication;
  @inject(SERVICE_IDENTIFIER.NEW_ACCOUNT_CREATOR)
  readonly _accountCreator?: IHostingAccountCreator;
  _options?: IHostingOptions | undefined;

  getOptions(): IHostingOptions | undefined {
    return this._options;
  }

  /**
   * Sets hosting options based on the provided value after validating it.
   *
   * @param {IHostingOptions} value - The hosting options to set.
   * @throws {HttpError} Throws a HttpError if validation fails, containing error details.
   * @returns {Promise<void>} A promise that resolves when the options are successfully set.
   */
  async setOptions(value: IHostingOptions) {
    const validationResult: IValidationResult = await new DtoValidator(HostingOptionsDto).validate(value);

    if (validationResult.status === 'ok') {
      this._options = value;
      return;
    }

    const validationError = new HttpDetailedError(errors.INVALID_HOSTING_PARAMETERS_ERROR);
    validationError.setMeta('validationMessage', validationResult.message);
    throw validationError;
  }

  get accountCreator(): IHostingAccountCreator | undefined {
    return this._accountCreator;
  }

  get twoFactorAutService(): ITwoFactorAuthentication | undefined {
    return this._twoFactorAutService;
  }

  public createNewAccount() {
    return this.accountCreator!.register({
      email: this.getOptions()?.email,
      hostingUrl: this.getOptions()?.hostingUrl,
    });
  }

  public async enableTwoFactorAuthentication() {
    console.log('UkraineHosting enableTwoFactorAuthentication');
  }
}
