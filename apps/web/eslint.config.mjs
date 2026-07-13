import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      /* ── TypeScript strictness ─────────────────────────────────────── */
      // Disallow the `any` type entirely — use `unknown` + type narrowing
      "@typescript-eslint/no-explicit-any": "error",
      // Require explicit return types on functions and class methods
      "@typescript-eslint/explicit-function-return-type": "off",
      // Disallow non-null assertions (use optional chaining instead)
      "@typescript-eslint/no-non-null-assertion": "warn",
      // Flag unused variables (allow underscore-prefixed exceptions)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      /* ── React ─────────────────────────────────────────────────────── */
      // Not needed with React 17+ new JSX transform
      "react/react-in-jsx-scope": "off",
      // Prefer arrow functions for components (convention)
      "react/display-name": "warn",

      /* ── General quality ────────────────────────────────────────────── */
      // Prevent accidental console.log left in production code
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // No debugger statements
      "no-debugger": "error",
      // Prefer const over let where possible
      "prefer-const": "error",
    },
  },
];

export default eslintConfig;
