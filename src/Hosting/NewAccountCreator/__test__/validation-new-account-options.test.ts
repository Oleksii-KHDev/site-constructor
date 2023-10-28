import { DtoValidator } from '../../../utils';
import { HostingAccountOptionsDto } from '../Dto/new-account-options.dto';
import 'reflect-metadata';

describe('Test of hosting options validation functionality', () => {
  test('Should pass validation', async () => {
    const testOption = {
      email: 'test@test.com',
      hostingUrl: 'https://test.com',
    };
    const validator = new DtoValidator(HostingAccountOptionsDto);
    expect(validator).toBeInstanceOf(DtoValidator);
    expect(validator).toHaveProperty('classToValidate');
    const result = await validator.validate(testOption);
    expect(result).toEqual(expect.objectContaining({ status: 'ok' }));
  });

  test('Should fails validation - email is absent', async () => {
    const testOption = {
      hostingUrl: 'https://test.com',
    };
    const validator = new DtoValidator(HostingAccountOptionsDto);
    expect(validator).toBeInstanceOf(DtoValidator);
    expect(validator).toHaveProperty('classToValidate');
    const result = await validator.validate(testOption);
    expect(result).toEqual(
      expect.objectContaining({ status: 'error', message: expect.stringContaining('Email have to be defined') }),
    );
  });

  test('Should fail validation - url without protocol', async () => {
    const testOption = {
      email: 'test@test.com',
      hostingUrl: 'test.com',
    };
    const validator = new DtoValidator(HostingAccountOptionsDto);
    expect(validator).toBeInstanceOf(DtoValidator);
    expect(validator).toHaveProperty('classToValidate');
    const result = await validator.validate(testOption);
    expect(result).toEqual(
      expect.objectContaining({ status: 'error', message: expect.stringContaining('Invalid hosting url') }),
    );
  });
});
