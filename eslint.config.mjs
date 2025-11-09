import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: [...nextCoreWebVitals, ...compat.extends("prettier")],

    rules: {
        "no-restricted-imports": ["warn", {
            patterns: [{
                group: [".*"],
                message: "Relative imports are not allowed, use absolute import instead.",
            }],
        }],

        "react/display-name": "off",
        "import/no-absolute-path": "off",

        "import/order": ["warn", {
            alphabetize: {
                order: "asc",
            },

            "newlines-between": "always",
        }],
    },
}]);
