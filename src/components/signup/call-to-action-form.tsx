import { ChangeEvent } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import { memo } from 'react';
import { useFormik } from 'formik';
import debounce from 'lodash/debounce';

import styles from './sign-up.module.css';
import { Button } from '@components/utils/button';
import { FormValues } from '@data-types/types';
import { subscribeMember } from '@utils/api/mailer-actions';
import { ErrorMessage } from '@components/utils/error-message';

const initialValues: FormValues = {
    email: '',
    firstName: '',
    lastName: '',
    other: ''
};

const validate = (values: FormValues): FormValues => {
    const errors = {} as FormValues;
    if (!values.firstName) {
        errors.firstName = 'Gotta name...?';
    } else if (!values.firstName.match(/^[a-zA-Z\s-]+$/i)) {
        errors.firstName = 'Only letters, spaces, or hyphens please';
    }

    if (values.lastName.trim() && !values.lastName.match(/^[a-zA-Z\s-]+$/i)) {
        errors.lastName = 'Only letters, spaces, or hyphens please';
    }

    if (!values.email) {
        errors.email = 'Gonna need an valid email for this';
    } else if (
        !values.email.match(
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        )
    ) {
        errors.email = "That email doesn't look quite right...";
    }

    if (values.other) {
        errors.other = 'You shouldn\'t be here...';
    }

    return errors;
};

const MemoizedInput = memo(({
        id,
        name,
        type = 'text',
        placeholder,
        value,
        onChange,
        className,
        label,
        error
    }: {
        id: string;
        name: string;
        type?: string;
        placeholder: string;
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        className: string;
        label: string;
        error?: string;
    }) => (
        <>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
            <input type={type}
                id={id}
                onChange={onChange}
                name={name}
                className={className}
                placeholder={placeholder}
                value={value} />
            {error && <ErrorMessage message={error} />}
        </>
    )
);

MemoizedInput.displayName = 'MemoizedInput';

const CallToActionForm = memo(() => {
    const [state, setState] = useState({
        success: false,
        error: false,
        message: ''
    });

    const debouncedValidate = useMemo(() => debounce((values: FormValues) => validate(values), 300), []);

    const { isSubmitting, errors, handleChange, handleSubmit, values } = useFormik({
        initialValues,
        validate: debouncedValidate,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async values => {
            const { ok } = await subscribeMember(values);

            setState({
                success: ok,
                error: !ok,
                message: ok ? 'Sign up was a success' : "That didn't work for some reason. Try again."
            });
        }
    });

    return (
        <div className={styles.formContainer}>
            {state?.success ? (
                <div className={styles.message}>
                    <p>
                        Check your email to confirm your subscription (double check your 
                        spam and filters if you don&apos;t see it right away). 💖
                    </p>
                </div>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <MemoizedInput
                        id="firstName"
                        name="firstName"
                        placeholder="First name"
                        value={values.firstName}
                        onChange={handleChange}
                        className={styles.input}
                        label="First Name"
                        error={errors.firstName}
                        aria-required="true"
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? 'firstName-error' : undefined} />
                    <MemoizedInput
                        id="lastName"
                        name="lastName"
                        placeholder="Last name"
                        value={values.lastName}
                        onChange={handleChange}
                        className={styles.input}
                        label="Last Name (Optional)"
                        error={errors.lastName} />
                    <MemoizedInput
                        id="email"
                        name="email"
                        placeholder="email@address.com"
                        value={values.email}
                        onChange={handleChange}
                        className={styles.input}
                        label="Email"
                        error={errors.email} />
                    <input type="text"
                        placeholder="Other"
                        className={styles.honeyPot}
                        onChange={handleChange}
                        name="other" />
                    {state.error && <ErrorMessage message={state.message} />}
                    <Button isPending={isSubmitting} className={styles.submitButton} type="submit" />
                </form>
            )}
            <p aria-live="polite" className="sr-only" role="status">
                {state?.message}
            </p>
        </div>
    );
});

CallToActionForm.displayName = 'CallToActionForm';

export default CallToActionForm;
