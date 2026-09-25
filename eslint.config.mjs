import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Uploaded images are served from /uploads at runtime and the landing pages
      // keep their original <img> markup, so plain <img> is intentional here.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-e2e/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project
    "_legacy-static/**",
    "data/**",
    "e2e/.data/**",
    "test-results/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
