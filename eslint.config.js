const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const globals = require("globals");

module.exports = defineConfig([
    expoConfig,
    {
        ignores: [
            "dist/*",
            ".expo/*",
            "plugin/build/*",
            "pufferpanel/*"
        ]
    },
    {
        files: ["scripts/**/*.cjs"],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    }
]);
