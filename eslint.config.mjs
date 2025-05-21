import importPlugin from "eslint-plugin-import";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import eslintTs from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...eslintTs.configs.recommended,
  {
    name: "General config",
    plugins: {
      "unused-imports": unusedImportsPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      "import": importPlugin
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_"
        }
      ],
      "import/newline-after-import": "error",
      "import/no-mutable-exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Node.js builtins prefixed with `node:`.
            ["^node:"],
            // Packages.
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ["^@?\\w"],
            // Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group.
            ["^"],
            // Relative imports.
            // Anything that starts with a dot.
            ["^\\."],
            // Side effect imports.
            ["^\\u0000"]
          ]
        }
      ]
    }
  },
  {
    ignores: ["dist"]
  }
];
