import Link from 'next/link';
import moment from 'moment';

import './footer.styles.css';

export const Footer = () => {
    return (
        <footer>
            <nav>
                <div className="grid grid-flow-col gap-4">
                    <a href="https://www.facebook.com/cloudcityfestival/" target="_blank" rel="noopener">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-current">
                            <path xmlns="http://www.w3.org/2000/svg"
                                d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/cloudcityfestival" target="_blank" rel="noopener">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            className="fill-current">
                            <path xmlns="http://www.w3.org/2000/svg"
                                d="M2 6C2 3.79086 3.79086 2 6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6ZM6 4C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6ZM12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12ZM17.5 8C18.3284 8 19 7.32843 19 6.5C19 5.67157 18.3284 5 17.5 5C16.6716 5 16 5.67157 16 6.5C16 7.32843 16.6716 8 17.5 8Z" />
                        </svg>
                    </a>
                </div>
            </nav>
            <div className="policy-section">
                <div>
                    <p><Link href="/conduct">Code of Conduct</Link></p>
                </div>
                <div>
                    <p><Link href="/terms-conditions">Terms & Conditions</Link></p>
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

