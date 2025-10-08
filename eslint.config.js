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
import unusedImports from 'eslint-plugin-unused-imports';

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
        ...globals.browser,  
        ...globals.node,     
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
      "unused-imports": unusedImports,
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
      ...testingLibrary.configs.react.rules,
      ...jestDom.configs.recommended.rules,
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off", 
      "react/jsx-uses-react": "off",     
      "react/prop-types": "off",      
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
      "unused-imports/no-unused-imports": "error",
    },
    ignores: ["node_modules", "dist", "build", "coverage", "eslint.config.js", "**/__tests__/**", "**/tests/**", "**/*.test.*", "**/*.spec.*",],
  }
];
