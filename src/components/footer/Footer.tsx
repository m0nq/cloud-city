import moment from 'moment';

import './Footer.styles.css';

export const Footer = () => {
    return (
        <footer className="bg-dark text-white p-4 text-center">
            <p>Copyright &copy; {moment().year()} Cloud City Festival. All rights reserved.</p>
        </footer>
    );
};

