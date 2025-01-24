import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import { FaFacebookF } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';

import styles from './footer.module.css';
import logo from '@public/cc-logo-blue-gradient-transparent.png';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.logoSection}>
                <Image src={logo}
                    alt="Pink and purple clouds at sunset"
                    sizes="100vw"
                    className="background-clouds"
                    width={84}
                    height={84}
                    priority />
            </div>
            <div className={styles.dividerSection}>
                <p>Explore</p>
            </div>
            <div className={styles.linksSection}>
                {/* TODO: About section */}
                {/*<a className={styles.footerLink}*/}
                {/*    href="/about">*/}
                {/*    <p>About</p>*/}
                {/*</a>*/}
                <a className={styles.footerLink}
                    href="https://docs.google.com/forms/d/e/1FAIpQLSegOvDswW0Xeg0wxrhaL_5BoAiOne9hDRCqwM58G-AXMAGKcQ/viewform"
                    target="_blank"
                    rel="noopener">
                    <p>Volunteer</p>
                </a>
            </div>
            <div className={styles.legalSection}>
                <div className={styles.locationContainer}>
                    <p>Oakland, CA</p>
                </div>
                <div className={styles.infoContainer}>
                    <Link className={styles.link} href="/conduct">
                        Code
                    </Link>
                    <Link className={styles.link} href="/terms-conditions">
                        Terms
                    </Link>
                    <Link className={styles.link} href="/privacy-policy">
                        Privacy
                    </Link>
                </div>
            </div>
            <div className={styles.finalSection}>
                <p className={styles.copyright}>
                    Copyright &copy; {moment().year()} Cloud City Festival. All rights reserved.
                </p>
                <div className={styles.socials}>
                    {/* TODO: Sound cloud icon will go here */}
                    {/*<a href="https://www.soundcloud.com/cloudcity"*/}
                    {/*    target="_blank"*/}
                    {/*    rel="noopener"*/}
                    {/*    className="flex justify-center items-center">*/}
                    {/*    <SoundCloudIcon size={23} />*/}
                    {/*</a>*/}
                    <a href="https://www.instagram.com/cloudcityfestival"
                        target="_blank"
                        rel="noopener"
                        className="flex items-center justify-center">
                        <FaInstagram size={23} color="#8888DD" />
                    </a>
                    <a href="https://www.facebook.com/cloudcityfestival/"
                        target="_blank"
                        rel="noopener"
                        className="flex items-center justify-center">
                        <FaFacebookF size={20} color="#8888DD" />
                    </a>
                </div>
            </div>
        </footer>
    );
};
