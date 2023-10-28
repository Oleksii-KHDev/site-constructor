import { HttpErrorDetailsArray } from 'site-constructor/errors';

/**
 * Captcha error codes
 */
export const CANT_FIND_CAPTCHA_IMAGE = 1002;
export const CAPTCHA_TEXT_NOT_RECOGNIZED = 1003;
export const CANT_FIND_CAPTCHA_TEXT_INPUT_FIELD = 1004;
export const CANT_SAVE_CAPTCHA_IMAGE_TO_DISK = 1005;
export const ERROR_USING_CAPTCHA_RECOGNISER_SERVICE = 1006;

/**
 * Captcha errors
 */
export const CANT_SAVE_CAPTCHA_IMAGE_TO_DISK_ERROR: HttpErrorDetailsArray = [
  500,
  "Can't save captcha image to disk",
  { errorCode: CANT_SAVE_CAPTCHA_IMAGE_TO_DISK },
];
export const CAPTCHA_TEXT_NOT_RECOGNIZED_ERROR: HttpErrorDetailsArray = [
  500,
  'Captcha text was not recognized successfully',
  { errorCode: CAPTCHA_TEXT_NOT_RECOGNIZED },
];
export const CANT_FIND_CAPTCHA_TEXT_INPUT_FIELD_ERROR: HttpErrorDetailsArray = [
  500,
  "Can't find captcha text input field",
  { errorCode: CANT_FIND_CAPTCHA_TEXT_INPUT_FIELD },
];
export const USING_CAPTCHA_RECOGNISER_SERVICE_ERROR: HttpErrorDetailsArray = [
  500,
  'Error occurred while using captcha recogniser service',
  { errorCode: ERROR_USING_CAPTCHA_RECOGNISER_SERVICE },
];
