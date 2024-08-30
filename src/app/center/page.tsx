import { ReactElement } from 'react';
import Image from 'next/image';

import './center-login.styles.css';
import { SignInForm } from '@app/center/signin-form';
import { SocialLogin } from '@app/center/social-login';
import cloudCityIcon from '@app/icon.svg';
import sunsetClouds from '@public/city-center/sunset-clouds-over-city.png';

const CityCenter = (): ReactElement => {
    return (
        <div className="login-container">
            <aside className="hero-image-aside">
                <div className="hero-image-container">
                    <Image src={sunsetClouds} loading="lazy" alt="Cloudy sunset over a city" className="hero-image" />
                    <div className="logo-container">
                        <Image src={cloudCityIcon} alt="Cloud City Icon" className="cloud-city-logo" />
                    </div>
                </div>
            </aside>
            <main className="login-form-area">
                <div className="login-form-container">
                    <h1 className="login-form-title">City Center</h1>
                    <SignInForm />
                    <SocialLogin />
                </div>
            </main>
        </div>
    );
};

export default CityCenter;
