import Image from 'next/image';

import cloudBackground from '@public/fluffy-clouds.png';
import './banner.styles.css';

export const Banner = () => {
    return (
        <div className="banner-section">
            <div className="banner-overlay" />
            <Image src={cloudBackground}
                alt="Pink and purple clouds at sunset"
                sizes="100vw"
                className="background-clouds"
                priority />
            <div className="banner-content-container">
                <div className="banner-content">
                    <h3>Hi-Fi Vibes</h3>
                    <h1 className="banner-title">Cloud City</h1>
                    <h2>Zero-Proof Party</h2>
                </div>
            </div>
        </div>
    );
};
