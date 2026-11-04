/**
 * Shared MORYX ESLint configuration for Angular projects.
 *
 * Usage in eslint.config.mjs:
 *
 *   import tseslint from "typescript-eslint";
 *   import angular from "angular-eslint";
 *   import { moryxConfig } from "@moryx/eslint-config";
 *
 *   export default tseslint.config(...moryxConfig(tseslint, angular));
 *
 * To override the component/directive selector prefix:
 *
 *   export default tseslint.config(
 *     ...moryxConfig(tseslint, angular, { prefix: "myApp" }),
 *   );
 */
export function moryxConfig(tseslint, angular, options = {}) {
  const prefix = options.prefix ?? "app";

  return [
    {
      ignores: ["**/api/**"],
    },
    {
      files: ["**/*.ts"],
      extends: [
        ...tseslint.configs.recommended,
        ...angular.configs.tsRecommended,
      ],
      processor: angular.processInlineTemplates,
      rules: {
        "@angular-eslint/use-lifecycle-interface": "error",
        "@angular-eslint/prefer-on-push-component-change-detection": "off",

        "@angular-eslint/component-selector": [
          "error",
          {
            type: "element",
            prefix,
            style: "kebab-case",
          },
        ],

        "@angular-eslint/directive-selector": [
          "error",
          {
            type: "attribute",
            prefix,
            style: "camelCase",
          },
        ],

        "curly": "error",

        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "warn",

        "@typescript-eslint/no-unused-vars": [
          "error",
          { args: "none", varsIgnorePattern: "^_", caughtErrors: "none" },
        ],
      },
    },
    {
      files: ["**/*.html"],
      extends: [
        ...angular.configs.templateRecommended,
        ...angular.configs.templateAccessibility,
      ],
      rules: {
        "@angular-eslint/template/no-negated-async": "error",
        "@angular-eslint/template/click-events-have-key-events": "off",
        "@angular-eslint/template/interactive-supports-focus": "off",
      },
    },
  ];
}