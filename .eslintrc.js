module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "prefer-destructuring": ["error", {"object": false, "array": false }],
    "max-len": ["error", { "code": 300 }],
    "no-underscore-dangle": ["error", { "allowAfterThis": true, "allowAfterSuper": true }],
    "camelcase": ["error", { "properties": "never" }],
    "no-console": ["error", { allow: ["warn", "error", "log", "table"] }],
  },
};
