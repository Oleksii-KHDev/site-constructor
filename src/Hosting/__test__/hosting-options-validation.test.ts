import { DtoValidator } from '../../utils/validation/DtoValidator';
import { HostingOptionsDto } from '../Dto/hosting-options.dto';
import 'reflect-metadata';

describe('Test of hosting options validation functionality', () => {
  test('Should pass validation', async () => {
    const testOption = {
      email: 'test@test.com',
      hostingUrl: 'https://test.com',
    };
    const validator = new DtoValidator(HostingOptionsDto);
    expect(validator).toBeInstanceOf(DtoValidator);
    expect(validator).toHaveProperty('classToValidate');
    const result = await validator.validate(testOption);
    expect(result).toEqual(expect.objectContaining({ status: 'ok' }));
  });

  test('Should fail validation - incorrect email', async () => {
    const testOption = {
      email: 'test_test.com',
      hostingUrl: 'https://test.com',
    };
    const validator = new DtoValidator(HostingOptionsDto);
    expect(validator).toBeInstanceOf(DtoValidator);
    expect(validator).toHaveProperty('classToValidate');
    const result = await validator.validate(testOption);
    expect(result).toEqual(
      expect.objectContaining({ status: 'error', message: expect.stringContaining('Invalid email') }),
    );
  });

  test('Should fail validation - incorrect url', async () => {
    const testOption = {
      email: 'test@test.com',
      hostingUrl: 'test.com',
    };
    const validator = new DtoValidator(HostingOptionsDto);
    expect(validator).toBeInstanceOf(DtoValidator);
    expect(validator).toHaveProperty('classToValidate');
    const result = await validator.validate(testOption);
    expect(result).toEqual(
      expect.objectContaining({ status: 'error', message: expect.stringContaining('Invalid hosting url') }),
    );
  });
});
