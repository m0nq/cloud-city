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
            body: ['var(--font-family-work-sans)', ...defaultTheme.fontFamily.sans]
        },
        extend: {
            colors: {
                'pale-pink': '#de78ed',
                sunset: '#ffbbb6',
                anakiwa: '#98ddfc',
                lavender: '#8888dd',
                'electric-violet': '#5b17ef',
                'moon-shadow-gray': '#c5c0c3'
            }
        }
    }
};

export default config;
