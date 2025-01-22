import Link from 'next/link';

import styles from './navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbarContainer}>
            <div className={styles.navbarArea}>
                <div className={styles.linkContainer}>
                    <Link href="/" className={styles.link}>
                        <p>Home</p>
                    </Link>
                </div>
                {/* TODO: enable when respective pages are created */}
                {/*<div className={styles.linkContainer}>*/}
                {/*    <Link href="/events" className={styles.link}>*/}
                {/*        <p>Events</p>*/}
                {/*    </Link>*/}
                {/*</div>*/}
                {/*<div className={styles.linkContainer}>*/}
                {/*    <Link href="/blog" className={styles.link}>*/}
                {/*        <p>Articles</p>*/}
                {/*    </Link>*/}
                {/*</div>*/}
            </div>
        </nav>
    );
};

export default Navbar;
