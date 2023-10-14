/**
 * @fileoverview
 * This module defines the DtoValidator class, which implements the IDtoValidator interface.
 * It provides methods for validating DTO (Data Transfer Object) instances using class-transformer and class-validator libraries.
 * @module DtoValidator
 */

import type { IDtoValidator, IValidationResult } from 'site-constructor/validation';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

/**
 * Represents a validator for DTO (Data Transfer Object) instances.
 * @implements {IDtoValidator}
 */
export class DtoValidator implements IDtoValidator {
  /**
   * Creates an instance of DtoValidator.
   * @param {ClassConstructor<object>} classToValidate - The class constructor representing the DTO class to validate.
   */
  constructor(private readonly classToValidate: ClassConstructor<object>) {}

  /**
   * Validates a DTO object using class-validator and class-transformer.
   * @async
   * @param {object} body - The DTO object to validate.
   * @returns {Promise<IValidationResult>} A promise that resolves to an IValidationResult object representing the
   * validation result and error message (if any).
   */
  async validate(body: object): Promise<IValidationResult> {
    const instance = plainToClass(this.classToValidate, body, { excludeExtraneousValues: true });

    try {
      await validateOrReject(instance);
      return { status: 'ok' };
    } catch (errors) {
      let errorMessages = '';

      if (errors instanceof Array && errors.every(this.isClassValidatorError)) {
        errorMessages = this.getAllErrorMessages(errors);
      } else if (errors instanceof Error) {
        errorMessages = errors.message || 'Unknown error';
      } else {
        errorMessages = 'Unknown error';
      }

      return { status: 'error', message: errorMessages };
    }
  }

  /**
   * Checks if the provided value is an instance of a ClassValidator `ValidationError`.
   *
   * @param {any} error - The value to check for being a `ValidationError`.
   * @returns {boolean} Returns `true` if the provided value is an instance of `ValidationError`, otherwise `false`.
   */
  isClassValidatorError(error: any): error is ValidationError {
    return error instanceof ValidationError;
  }

  /**
   * Concatenates and formats error messages from an array of ClassValidator `ValidationError` objects.
   *
   * @param {Array<ValidationError>} validationErrors - An array of `ValidationError` objects.   *
   * @returns {string} A formatted string containing all the error messages from the provided `ValidationError` objects,
   * separated by periods and trimmed.
   */
  getAllErrorMessages(validationErrors: Array<ValidationError>): string {
    return validationErrors
      .reduce((errors: Array<string>, error) => {
        const addErrorMessages = (err: ValidationError) => {
          if (err.children && err.children.length > 0) {
            err.children.forEach((e) => addErrorMessages(e));
          } else {
            if (err.constraints) {
              Object.keys(err.constraints).forEach((key) => errors.push(err.constraints![key] as string));
            }
          }
        };
        /**
         * Recursively adds error messages to the reducer accumulator
         */
        addErrorMessages(error);
        return errors;
      }, [])
      .join('. ')
      .trim()
      .concat('.');
  }
}
