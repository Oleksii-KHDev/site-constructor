declare module 'site-constructor/validation' {
  /**
   * @TODO: Find solution how to use enums in the code from the @types folder
   */
  export enum ValidationStatus {
    ok = 'ok',
    error = 'error',
  }

  export type ValidationResultStatus = 'ok' | 'error';

  export interface IValidationResult {
    status: ValidationResultStatus;
    message?: string;
  }

  export interface IDtoValidator {
    validate: (body: object) => Promise<IValidationResult>;
  }
}
