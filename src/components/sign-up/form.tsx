'use client';
import { useState } from 'react';
import { useFormik } from 'formik';

import './sign-up.styles.css';
import { Button } from '@components/utils/button';
import { FormValues } from '@data-types/types';
import { subscribeMember } from '@utils/api/mailer-actions';
import { ErrorMessage } from '@components/utils/error-message';

const initialValues: FormValues = {
    email: '',
    firstName: '',
    lastName: ' ',
    other: ''
};

const validate = (values: FormValues): FormValues => {
    const errors = {} as FormValues;
    if (!values.firstName) {
        errors.firstName = 'This should have a few more letters...';
    } else if (!values.firstName.match(/^[a-zA-Z\s-]+$/i)) {
        errors.firstName = 'Try without special characters...';
    }

    if (!values.lastName.match(/^[a-zA-Z\s-]+$/i)) {
        errors.lastName = 'Try without special characters...';
    }

    if (!values.email) {
        errors.email = 'You\'ll need an email to sign up!';
    } else if (!values.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
        errors.email = 'That email doesn\'t look quite right...';
    }

    if (values.other) {
        errors.other = 'You shouldn\'t be here...';
    }

    return errors;
};

export const Form = () => {
    const [state, setState] = useState({ success: false, error: false, message: '' });
    const {
        isSubmitting,
        errors,
        handleChange,
        handleSubmit,
        values
    } = useFormik({
        initialValues,
        validate,
        onSubmit: async values => {
            const { ok } = await subscribeMember(values);

            setState({
                success: ok,
                error: !ok,
                message: ok ? 'Sign up was a success' : 'There was an error'
            });
        }
    });

    return (
        <>
            {state?.success ? (
                <div className="message">
                    <p>Awesome! We&apos;ll see you soon 💖</p>
                </div>
            ) : (
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input type="text"
                        id="firstName"
                        onChange={handleChange}
                        name="firstName"
                        value={values.firstName} />
                    {errors.firstName && <ErrorMessage message={errors.firstName} />}
                    <label htmlFor="lastName">Last Name (Optional)</label>
                    <input type="text"
                        id="lastName"
                        onChange={handleChange}
                        name="lastName"
                        value={values.lastName} />
                    {errors.lastName && <ErrorMessage message={errors.lastName} />}
                    <label htmlFor="email">Email</label>
                    <input type="text"
                        id="email"
                        onChange={handleChange}
                        name="email"
                        value={values.email} />
                    {errors.email && <ErrorMessage message={errors.email} />}
                    <input type="text"
                        placeholder="Other"
                        className="honey-pot"
                        onChange={handleChange}
                        name="other" />
                    {state.error && <ErrorMessage message={state.message} />}
                    <Button isPending={isSubmitting} className="submit-button" type="submit" />
                </form>
            )}
            <p aria-live="polite" className="sr-only" role="status">{state?.message}</p>
        </>
    );
};
