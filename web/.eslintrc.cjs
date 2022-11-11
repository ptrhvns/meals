module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  root: true,
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
