module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ["temp.js", "node_modules/", "out/"],
  rules: {
    "@typescript-eslint/no-var-requires": "warn"

    // Overwrite rules specified from the extended configs e.g. 
    // "@typescript-eslint/explicit-function-return-type": "off",


  }
}