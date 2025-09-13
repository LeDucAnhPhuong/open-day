// eslint.config.mjs
import tseslint from "typescript-eslint";
import next from "@next/eslint-plugin-next";

export default [
  {
    ignores: ["node_modules/**", ".next/**", "dist/**", ".turbo/**", "coverage/**"]
  },
  ...tseslint.config({
    files: ["**/*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.eslint.json"]
      }
    },
    plugins: { "@next/next": next },
    rules: {
      "@typescript-eslint/no-floating-promises": "error"
    }
  }),
  // Tắt typed rules cho file config/scripts nếu muốn
  {
    files: ["**/*.config.*", "scripts/**"],
    extends: [tseslint.configs.disableTypeChecked]
  }
];
