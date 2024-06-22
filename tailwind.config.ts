import defaultTheme from 'tailwindcss/defaultTheme';
import { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        fontFamily: {
            sans: ['var(--font-family-montserrat-alt1)', 'var(--font-family-source-sans)', ...defaultTheme.fontFamily.sans]
        },
        extend: {
            // backgroundImage: {
            //     'cloud-image': ''
            // }
            // colors: {
            //     'dark': '#181a1b',
            //     'primary': 'hotpink',
            //     'secondary': 'dodgerblue'
            // }
        }
    },
    plugins: []
};

export default config;
