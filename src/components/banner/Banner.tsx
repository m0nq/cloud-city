import Image from 'next/image';

import cloudBackground from '@public/Image 3.png';
import './Banner.styles.css';

export const Banner = () => {
    return (
        <div className="banner-section">
            <Image src={cloudBackground}
                alt="Pink and purple clouds at sunset"
                sizes="100vw"
                className="background-clouds"
                priority />
        </div>
    );
};
