import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
    {
        ignores: ["coverage/**", ".next/**", "node_modules/**"],
    },
    ...nextCoreWebVitals,
    {
        rules: {
            semi: ["error", "always"],
            "jsx-quotes": ["error", "prefer-double"],
        },
    },
];

export default eslintConfig;
