import defaultTheme from 'tailwindcss/defaultTheme';
import { Config } from 'tailwindcss';

/* dark mode color #1E2329 */
const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        fontFamily: {
            heading: ['var(--font-family-montserrat-alt1)', ...defaultTheme.fontFamily.sans],
            subheading: ['var(--font-family-montserrat)', ...defaultTheme.fontFamily.sans],
            body: ['var(--font-family-nunito-sans)', ...defaultTheme.fontFamily.sans]
        },
        colors: {
            primary: '#8888dd',
            'zinc-800': '#27272a',
            'zinc-600': '#52525b',
            black: '#000000',
            white: '#ffffff',
            'indigo-800': '#3730a3',
            'indigo-200': '#c7d2fe'
        }
    }
};

export default config;
