import cloudBackground from '@public/cloud-bg-image.png';
import Image from 'next/image';

import './Banner.styles.css';

export const Banner = () => {
    return (
        <div className="banner-section">
            <Image src={cloudBackground}
                alt="Pink and purple clouds at sunset"
                className="background-clouds"
                priority />
        </div>
    );
};
