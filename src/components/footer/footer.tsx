import moment from 'moment';

import './footer.styles.css';

export const Footer = () => {
    return (
        <footer>
            <p>Copyright &copy; {moment().year()} Cloud City Festival. All rights reserved.</p>
        </footer>
    );
};

