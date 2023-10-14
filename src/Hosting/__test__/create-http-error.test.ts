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
  test('Should returns INVALID_REGISTRATION_OPTIONS_ERROR', async () => {
    expect.assertions(6);

    try {
      const result = await UkraineHostingNewAccountCreator.prototype.register();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(HttpError);
      expect((err as HttpError).name).toEqual('BadRequestError');
      expect((err as HttpError).status).toEqual(400);
      expect((err as HttpError).code).toEqual(INVALID_REGISTRATION_OPTIONS);
      expect((err as HttpError).message).toEqual(expect.stringContaining(INVALID_REGISTRATION_OPTIONS_ERROR[1]));
    }
  });
});
