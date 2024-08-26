'use client';
import { useState } from 'react';
import { PiEnvelopeThin } from 'react-icons/pi';
import { PiLockLight } from 'react-icons/pi';
import { PiEye } from 'react-icons/pi';
import { PiEyeClosed } from 'react-icons/pi';

export const SignInForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="login-form-area">
            <h2 className="login-form-title">Sign in</h2>
            <div className="input-area">
                <label htmlFor="email" className="label">Email</label>
                <div className="input-container">
                    <PiEnvelopeThin size={22} />
                    <input type="email" id="email" placeholder="email@address.com" className="input" />
                </div>
            </div>
            <div className="input-area">
                <label htmlFor="password" className="label">Password</label>
                <div className="input-container">
                    <PiLockLight size={22} />
                    <input type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Enter Password"
                        className="input" />
                    {showPassword ?
                        <PiEye size={20} onClick={() => setShowPassword(!showPassword)} /> :
                        <PiEyeClosed size={20} onClick={() => setShowPassword(!showPassword)} />
                    }
                </div>
            </div>
            <div className="confirmation-area">
                <div className="confirmation-container">
                    <input type="checkbox" id="confirmation-checkbox" className="confirmation-checkbox" />
                    <label htmlFor="confirmation-checkbox">Remember Me</label>
                </div>
                <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="submit-button">Login</button>
        </form>
    );
};
