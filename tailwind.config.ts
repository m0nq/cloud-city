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
            sans: ['var(--quicksand-font-family)', ...defaultTheme.fontFamily.sans]
        },
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
            },
            colors: {
                'dark': '#181a1b',
                'primary': 'hotpink',
                'secondary': 'dodgerblue'
            }
        }
    },
    plugins: []
};

export default config;
