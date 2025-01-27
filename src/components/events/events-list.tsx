import { PiMapPinLight } from 'react-icons/pi';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';

import styles from './events-section.module.css';

export const EventsList = ({ posts }: { posts?: any[] }) => {
    return (
        <div className={styles.eventsListContainer}>
            <ul className={styles.ul}>
                {(posts?.length &&
                    posts.map(({ post }) => (
                        <li key={post.databaseId} className={styles.li}>
                            <Link
                                href={`/events${post.uri.startsWith('/') ? post.uri : `/${post.uri}`}`}
                                className={styles.anchor}>
                                <div className={styles.dateTimeContainer}>
                                    <p>&gt;</p>
                                    {/* Parsing the date with moment may not be needed */}
                                    <p>{moment(post?.events?.eventDateTime || post.date).format('MMM Do, YYYY')}</p>
                                    <p>{moment(post?.events?.eventDateTime || post.date).format('h:mm A')}</p>
                                </div>
                                <div className={styles.detailsContainer}>
                                    <Image
                                        src={post.featuredImage.node.sourceUrl}
                                        alt={post.featuredImage.node.altText || 'Blog featured image'}
                                        sizes={post.featuredImage.node.sizes}
                                        className={styles.featuredImage}
                                        width={280}
                                        height={170}
                                        priority
                                    />
                                    <div className={styles.contentContainer}>
                                        <h4 className={styles.h4}>{post.title}</h4>
                                        <div
                                            className={styles.paragraph}
                                            dangerouslySetInnerHTML={{
                                                __html: post.excerpt || 'No description available'
                                            }}
                                        />
                                        <div className={styles.locationDetailsContainer}>
                                            <PiMapPinLight color="#de78ed" size={24} />
                                            <p className={styles.address}>{post.events?.address || 'Location TBA'}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))) || (
                    <li className={styles.li}>
                        <div className={styles.dateTimeContainer}>
                            <p>&gt;</p>
                        </div>
                        <div className={styles.detailsContainer}>
                            <div className={styles.contentContainer}>
                                <h4 className={styles.h4}>No upcoming events</h4>
                                <p className={styles.paragraph}>Sign up for our newletter to stay updated</p>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
};
