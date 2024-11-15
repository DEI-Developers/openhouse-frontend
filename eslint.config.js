import globals from "globals";
import pluginReact from "eslint-plugin-react";
import googleConfig from "eslint-config-google";
import prettier from "eslint-plugin-prettier";

const googleRules = {
  ...googleConfig.rules,
  "valid-jsdoc": "off",
  "require-jsdoc": "off",
};

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["dist/**", "eslint.config.js", "prettier.config.cjs"],
    languageOptions: {
      globals: {...globals.browser, ...globals.node},
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react: pluginReact,
      prettier: prettier,
    },
    rules: {
      ...googleRules,
      indent: ["error", 2],
      "no-unused-vars": ["warn", {vars: "all", args: "after-used", ignoreRestSiblings: true}],
      "comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "never",
          exports: "never",
          functions: "never",
        },
      ],
    },
  },
];

