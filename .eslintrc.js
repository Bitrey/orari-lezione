module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 12
    },
    rules: {
        indent: ["warn", 4],
        "linebreak-style": ["warn", "windows"],
        quotes: ["warn", "double"],
        semi: ["warn", "always"]
    }
};
