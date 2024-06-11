module.exports = {
  extends: [
    'expo',
    'prettier',
    'plugin:@tanstack/eslint-plugin-query/recommended'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'
  },
  env: {
    jest: true
  }
};
