module.exports = [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/no-explicit-any": ["error"],
      "@typescript-eslint/explicit-module-boundary-types": ["error"],
      "@typescript-eslint/no-inferrable-types": ["error"],
      "@typescript-eslint/explicit-function-return-type": ["error"],
    },
  },
];
