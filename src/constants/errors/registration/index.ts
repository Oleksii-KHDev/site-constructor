import { HttpErrorDetailsArray } from 'site-constructor/errors';

export const INVALID_REGISTRATION_OPTIONS = 1000;
export const CANT_FIND_REGISTRATION_BUTTON = 1001;
export const CANT_FIND_NECESSARY_SELECTOR = 1007;
export const INVALID_REGISTRATION_OPTIONS_ERROR: HttpErrorDetailsArray = [
  400,
  'There are no necessary registration options',
  { errorCode: INVALID_REGISTRATION_OPTIONS },
];
export const CANT_FIND_REGISTRATION_BUTTON_ERROR: HttpErrorDetailsArray = [
  500,
  "Can't find registration button on the page",
  { errorCode: CANT_FIND_REGISTRATION_BUTTON },
];
