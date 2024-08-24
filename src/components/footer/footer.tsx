import Link from 'next/link';
import moment from 'moment';
import { FaFacebookF } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';

import './footer.styles.css';

export const Footer = () => {
    return (
        <footer>
            <nav>
                <div className="grid grid-flow-col gap-4">
                    <a href="https://www.facebook.com/cloudcityfestival/"
                        target="_blank"
                        rel="noopener"
                        className="flex justify-center items-center">
                        <FaFacebookF size={20} />
                    </a>
                    <a href="https://www.instagram.com/cloudcityfestival"
                        target="_blank"
                        rel="noopener"
                        className="flex justify-center items-center">
                        <FaInstagram size={23} />
                    </a>
                </div>
            </nav>
            <div className="policy-section">
                <div>
                    <p><Link href="/conduct">Code of Conduct</Link></p>
                </div>
                <div>
                    <p><Link href="/terms-conditions">Terms &amp; Conditions</Link></p>
                </div>
                <div>
                    <p><Link href="/privacy-policy">Privacy Policy</Link></p>
                </div>
            </div>
            <div className="copyright">
                <p>
                    Copyright &copy; {moment().year()} Cloud City Festival. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

