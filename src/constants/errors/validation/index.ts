import { HttpErrorDetailsArray } from 'site-constructor/errors';

export const ERROR_HOSTING_CREATION_OPTIONS = 1009;
export const INVALID_HOSTING_PARAMETERS_ERROR: HttpErrorDetailsArray = [
  400,
  'invalid hosting parameters',
  { errorCode: ERROR_HOSTING_CREATION_OPTIONS },
];

/**
 * Don't use this error now
 */
export const ERROR_HOSTING_ACCOUNT_REGISTRATION_OPTIONS = 1008;
export const INVALID_HOSTING_ACCOUNT_REGISTRATION_PARAMETERS_ERROR: HttpErrorDetailsArray = [
  400,
  'invalid parameters for registration new hosting account',
  { errorCode: ERROR_HOSTING_ACCOUNT_REGISTRATION_OPTIONS },
];
