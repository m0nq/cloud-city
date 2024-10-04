import localFont from 'next/font/local';
import { Nunito_Sans } from 'next/font/google';
import { Montserrat } from 'next/font/google';

export const montserratAlt1 = localFont({
    src: [
        {
            path: '../../fonts/otf/MontserratAlt1-Thin.otf',
            weight: '100',
            style: 'thin'
        },
        {
            path: '../../fonts/otf/MontserratAlt1-ExtraLight.otf',
            weight: '200',
            style: 'extralight'
        },
        {
            path: '../../fonts/otf/MontserratAlt1-Light.otf',
            weight: '300',
            style: 'light'
        },
        {
            path: '../../fonts/otf/MontserratAlt1-Regular.otf',
            weight: '400',
            style: 'normal'
        },
        {
            path: '../../fonts/otf/MontserratAlt1-Black.otf',
            weight: '400',
            style: 'italic'
        },
        {
            path: '../../fonts/otf/MontserratAlt1-Medium.otf',
            weight: '500',
            style: 'medium'
        },
        {
            path: '../../fonts/otf/MontserratAlt1-SemiBold.otf',
            weight: '600',
            style: 'semibold'
        },
        {
            path: '../../fonts/otf/MontserratAlt1-Bold.otf',
            weight: '700',
            style: 'bold'
        },
        {
            path: '../../fonts/otf/MontserratAlt1-ExtraBold.otf',
            weight: '800',
            style: 'extrabold'
        }
    ],
    variable: '--font-family-montserrat-alt1'
});

export const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-family-montserrat'
});

export const nunitoSans = Nunito_Sans({
    subsets: ['latin'],
    variable: '--font-family-nunito-sans'
});
