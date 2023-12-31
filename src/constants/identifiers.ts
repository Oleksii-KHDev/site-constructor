const SERVICE_IDENTIFIER = {
  HOSTING: Symbol.for('Hosting'),
  HOSTING_FACTORY: Symbol.for('HostingFactory'),
  UKRAINE_HOSTING_FACTORY: Symbol.for('UkraineHostingFactory'),
  NEW_ACCOUNT_CREATOR: Symbol.for('NewAccountCreator'),
  CAPTCHA_RECOGNISER: Symbol.for('CaptchaRecogniser'),
  TWO_FACTOR_AUTHENTICATION_SERVICE: Symbol.for('TwoFactorAuthenticationService'),
  BROWSER: Symbol.for('Browser'),
};

export default SERVICE_IDENTIFIER;
