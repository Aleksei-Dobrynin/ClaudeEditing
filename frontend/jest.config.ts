module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    // !
    extensionsToTreatAsEsm: ['.jsx'],
    moduleDirectories: ['node_modules1', 'testing'],
    presets: [
      '@babel/preset-env',
      ['@babel/preset-react', {runtime: 'automatic'}],
    ],
  }
  