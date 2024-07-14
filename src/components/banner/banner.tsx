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
                    <h3>July 27th</h3>
                    <h1 className="banner-title">Cloud City</h1>
                    <h2>Hi-Fi Vibes. Zero-Proof Party.</h2>
                </div>
            </div>
        </div>
    );
};
// <div className="hero banner-section" style={{ backgroundImage: `url(${cloudBackground.src})` }}>
// {/*<div className="hero-overlay bg-opacity-60"></div>*/}
// {/*<div className="hero-content text-neutral-content text-center">*/}
// <div>
// {/*<div className="max-w-md">*/}
// {/*<div>*/}
// {/*<h1 className="mb-5 text-5xl font-bold">Hello there</h1>*/}
// {/*<p className="mb-5">*/}
// {/*    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem*/}
// {/*    quasi. In deleniti eaque aut repudiandae et a id nisi.*/}
// {/*</p>*/}
// {/*<button className="btn btn-primary">Get Started</button>*/}
// {/*            <h3>July 27th</h3>*/}
// {/*            <h1 className="banner-title">Cloud City</h1>*/}
// {/*            <h2>Hi-Fi Vibes. Zero-Proof Party.</h2>*/}
// {/*        </div>*/}
// {/*    </div>*/}
// {/*</div>*/}
