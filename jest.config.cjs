module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 4,
  setupFilesAfterEnv: ['jest-extended/all'],
  modulePathIgnorePatterns: ['<rootDir>/.build/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^site-constructor/(.*)$': '<rootDir>/@types/site-constructor/$1',
  },
  moduleDirectories: ["node_modules", '@types', 'src'],
};

require('dotenv').config({ path: './.env.test' });
