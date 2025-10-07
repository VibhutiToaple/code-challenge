// eslint.config.js
import js from "@eslint/js";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import testingLibrary from "eslint-plugin-testing-library";
import jestDom from "eslint-plugin-jest-dom";

export default [
  {
    ignores: ["dist", "build", "node_modules"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,  // ✅ Browser globals (window, document, etc.)
        ...globals.node,     // ✅ Node globals (__dirname, process, NodeJS namespace)
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": hooks,
      import: importPlugin,
      "@typescript-eslint": ts,
      prettier,
      "testing-library": testingLibrary,
      "jest-dom": jestDom,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
    },
    
    rules: {
      ...react.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      // ✅ Testing Library rules
      ...testingLibrary.configs.react.rules,
      // ✅ Jest DOM rules
      ...jestDom.configs.recommended.rules,
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off", // ✅ Fix for your error
      "react/jsx-uses-react": "off",     // ✅ Optional: also disable this deprecated rule
      "react/prop-types": "off",      // ✅ Since you are using TypeScript for type checking
      "@typescript-eslint/no-unused-vars": ["warn"],
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          "newlines-between": "always",
        },
      ],
      "no-console": "warn",
      "@typescript-eslint/no-explicit-any": "off",
    },
    ignores: ["node_modules", "dist", "build", "coverage", "eslint.config.js", "**/__tests__/**", "**/tests/**", "**/*.test.*", "**/*.spec.*",],
  }
];
