import { HttpDetailedError } from '../../utils/errors/HttpDetailedError/http-detailed-error.class';

const mockNewPage = jest.fn().mockResolvedValue({});
const mockClose = jest.fn().mockResolvedValue(null);

const mockLaunch = jest.fn().mockResolvedValue({
  newPage: mockNewPage,
  close: mockClose,
});

jest.mock('puppeteer', () => ({
  launch: mockLaunch,
}));

import { UkraineHostingNewAccountCreator } from '../NewAccountCreator';
import { HttpError } from 'http-errors';
import { INVALID_REGISTRATION_OPTIONS, INVALID_REGISTRATION_OPTIONS_ERROR } from '../../constants';

describe('Test creating http-error from http-errors package with constants error values', () => {
  test('Should returns INVALID_REGISTRATION_OPTIONS_ERROR - options object is absent', async () => {
    expect.assertions(7);

    try {
      const result = await UkraineHostingNewAccountCreator.prototype.register();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(HttpError);
      expect((err as HttpError).name).toEqual('HttpDetailedError');
      expect((err as HttpError).status).toEqual(400);
      expect((err as HttpError).statusCode).toEqual(400);
      expect((err as HttpError).errorCode).toEqual(INVALID_REGISTRATION_OPTIONS);
      expect((err as HttpError).message).toEqual(
        expect.stringContaining(INVALID_REGISTRATION_OPTIONS_ERROR[1] as string),
      );
    }
  });

  test('Returned error should contain validation error messages', async () => {
    expect.assertions(11);

    const testOption = {
      email: 'test_test.com',
      hostingUrl: 'https://test.com',
    };

    try {
      const result = await UkraineHostingNewAccountCreator.prototype.register.call(
        { _captchaRecogniser: {} },
        testOption,
      );
    } catch (err) {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(HttpError);
      expect((err as HttpError).name).toEqual('HttpDetailedError');
      expect((err as HttpError).status).toEqual(400);
      expect((err as HttpError).statusCode).toEqual(400);
      expect((err as HttpError).errorCode).toEqual(INVALID_REGISTRATION_OPTIONS);
      expect((err as HttpError).message).toEqual(
        expect.stringContaining(INVALID_REGISTRATION_OPTIONS_ERROR[1] as string),
      );
      expect(err as HttpDetailedError).toHaveProperty('validationMessage');
      expect((err as HttpDetailedError).validationMessage).toEqual(expect.stringContaining('Invalid email'));
      expect(err as HttpDetailedError).toHaveProperty('setMeta');
      expect(err as HttpDetailedError).toHaveProperty('getMeta');
    }
  });
});
