// eslint-disable-next-line no-undef
module.exports = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "unused-imports"],
    root: true,
    ignorePatterns: ["node_modules", "bin", "cli.js"],
    rules: {
        "unused-imports/no-unused-imports": "error",
        quotes: ["error", "double"],
        "object-shorthand": "error",
        "no-else-return": "error",
        "padding-line-between-statements": [
            "error",
            { blankLine: "always", prev: ["block-like"], next: "*" },
            { blankLine: "always", prev: "*", next: "return" },
        ],
    },
};
