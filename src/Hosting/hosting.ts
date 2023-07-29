import { NewAccountCreator } from './NewAccountCreator';

/**
 * Main class for hosting functionality
 */
export class Hosting {
  constructor(protected readonly options: object = {}) {}
  public createNewAccount() {
    const newAccountCreator = new NewAccountCreator();
  }
}
