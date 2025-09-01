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
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Allow React unescaped entities for better readability
      "react/no-unescaped-entities": "off",
      
      // Relax TypeScript strict rules for development
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      
      // Allow img elements (Next.js Image is not always suitable)
      "@next/next/no-img-element": "warn",
      
      // Allow missing alt text warnings instead of errors
      "jsx-a11y/alt-text": "warn",
      
      // Allow prefer-const warnings
      "prefer-const": "warn",
      
      // Allow this aliasing
      "@typescript-eslint/no-this-alias": "off",
    },
  },
];

export default eslintConfig;
