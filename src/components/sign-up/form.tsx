import './sign-up.styles.css';

export const Form = () => {
    return (
        <>
            <form className="form">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" />
                <label htmlFor="firstName">Last Name (Optional)</label>
                <input type="text" id="lastName" />
                <label htmlFor="email">Email</label>
                <input type="text" id="email" />
                <input type="text" placeholder="Other" className="honey-pot" maxLength={0} name="other" />
                <button type="submit" className="submit-button"><span>Subscribe</span></button>
            </form>
        </>
    );
};
