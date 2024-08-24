import { ReactElement } from 'react';

import './center.styles.css';
import SignInForm from '@app/center/signin-form';
import SocialLogin from '@app/center/social-login';

const CityCenter = (): ReactElement => {
    return (
        <div className="login-container">
            <aside className="hero-image-aside">
                <div className="hero-image-container">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5b144d51dca82e7d4ca8db99f818d88395797b39027f92d42fe8eff05ed0e03f?placeholderIfAbsent=true&apiKey=30d3d8415b44457fb2b5713118cbf796"
                        alt="Cloudy sunset over a city" className="hero-image" />
                    <div className="logo-container">
                        <img loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e95811f4bd9a056e2ac4274a97a6ea42ffa002f8c9e25a2da4ed892a5221fe47?placeholderIfAbsent=true&apiKey=30d3d8415b44457fb2b5713118cbf796"
                            alt="City City logo" className="cloud-city-logo" />
                    </div>
                </div>
            </aside>
            <main className="login-form-area">
                <div
                    className="login-form-container">
                    <h1 className="self-center text-5xl font-light text-center max-md:text-4xl">
                        City Center
                    </h1>
                    <SignInForm />
                    <SocialLogin />
                </div>
            </main>
        </div>
    );
};

export default CityCenter;
