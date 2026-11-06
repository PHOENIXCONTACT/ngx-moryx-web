# @moryx/eslint-config

Shared ESLint configuration for MORYX Angular projects.

## Installation

```bash
npm install --save-dev @moryx/eslint-config typescript-eslint angular-eslint
```

## Usage

Create an `eslint.config.mjs` in your project root:

```js
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import { moryxConfig } from "@moryx/eslint-config";

export default tseslint.config(...moryxConfig(tseslint, angular));
```

### Custom selector prefix

By default the component/directive selector prefix is `"app"`. To override it:

```js
export default tseslint.config(
  ...moryxConfig(tseslint, angular, { prefix: "moryx" }),
);
```

### Extending with project-specific rules

Spread the config and add your own overrides:

```js
export default tseslint.config(
  ...moryxConfig(tseslint, angular),
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
);
```

## Included rules

### TypeScript (`**/*.ts`)

Extends `typescript-eslint` recommended and `angular-eslint` recommended.

| Rule | Severity | Notes |
| --- | --- | --- |
| `@angular-eslint/use-lifecycle-interface` | error | Require lifecycle hook interfaces |
| `@angular-eslint/prefer-on-push-component-change-detection` | off | Allows `ChangeDetectionStrategy.Eager` |
| `@angular-eslint/component-selector` | error | Enforces kebab-case with configurable prefix |
| `@angular-eslint/directive-selector` | error | Enforces camelCase with configurable prefix |
| `curly` | error | Always require braces around blocks |
| `@typescript-eslint/no-empty-function` | off | Relaxed for Angular patterns |
| `@typescript-eslint/no-explicit-any` | warn | Discourages `any` without blocking |
| `@typescript-eslint/no-unused-vars` | error | Ignores function args and `_`-prefixed vars |

### Templates (`**/*.html`)

Extends `angular-eslint` template recommended and accessibility configs.

| Rule | Severity | Notes |
| --- | --- | --- |
| `@angular-eslint/template/no-negated-async` | error | Prefer `(obs \| async) === false` |
| `@angular-eslint/template/click-events-have-key-events` | off | Angular Material handles this |
| `@angular-eslint/template/interactive-supports-focus` | off | Angular Material handles this |

### Ignored paths

| Pattern | Reason |
| --- | --- |
| `**/api/**` | Auto-generated API clients |