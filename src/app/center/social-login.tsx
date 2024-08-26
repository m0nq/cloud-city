import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import './center-login.styles.css';

export const SocialLogin = () => {
    // TODO: implement social login actions
    return (
        <div className="social-login-container">
            <p className="social-login-label">or continue with</p>
            <div className="social-icons-container">
                <FaApple size={30} />
                <FcGoogle size={30} />
            </div>
        </div>
    );
};

