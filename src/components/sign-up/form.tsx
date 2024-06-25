'use client';
import { useFormik } from 'formik';

import './sign-up.styles.css';
import { SubmitButton } from '@components/utils/submit-button';
import { useState } from 'react';

export type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    other: string;
}

const validate = (values: FormValues): FormValues => {
    const errors = {} as FormValues;
    if (!values.firstName) {
        errors.firstName = 'This should have a few more characters';
    }

    if (!values.email) {
        errors.email = 'You\'ll need an email to sign up!';
    } else if (!values.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
        errors.email = 'Something doesn\'t look right here...';
    }

    if (values.other) {
        errors.other = 'You shouldn\'t be here...';
    }

    return errors;
};

export const Form = () => {
    const [state, setState] = useState({ success: false, error: false, message: '' });
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            other: ''
        },
        validate,
        onSubmit: async values => {
            try {
                const res = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                });

                setState({
                    success: res.ok,
                    error: !res.ok,
                    message: res.ok ? 'Sign up was a success' : 'There was an error'
                });
            } catch (e: any) {
                setState({
                    success: false,
                    error: true,
                    message: 'There was a network error. Perhaps refresh and try again?'
                });

            }
        }
    });

    return (
        <>
            {state?.success ? (
                <div className="message">
                    <p>Awesome! We&apos;ll see you soon 💖</p>
                </div>
            ) : (
                <form className="form" onSubmit={formik.handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" onChange={formik.handleChange} name="firstName"
                        value={formik.values.firstName} />
                    {formik.errors.firstName ?
                        <div className="text-center">{formik.errors.firstName}</div> : null}
                    <label htmlFor="lastName">Last Name (Optional)</label>
                    <input type="text" id="lastName" onChange={formik.handleChange} name="lastName"
                        value={formik.values.lastName} />
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" onChange={formik.handleChange} name="email"
                        value={formik.values.email} />
                    {formik.errors.email ? <div className="text-center">{formik.errors.email}</div> : null}
                    <input type="text"
                        placeholder="Other"
                        className="honey-pot"
                        onChange={formik.handleChange}
                        name="other" />
                    {state?.error && (<p className="text-center">Oops... Something weird happened. Try again?</p>)}
                    <SubmitButton />
                    <p aria-live="polite" className="sr-only" role="status">{state?.message}</p>
                </form>
            )}
        </>
    );
};
