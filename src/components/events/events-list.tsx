import { PiMapPinLight } from 'react-icons/pi';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';

import styles from './events-section.module.css';
import { FlattenedEvent } from '@data-types/types';

export const EventsList = ({ events }: { events?: FlattenedEvent[] }) => {
    return (
        <div className={styles.eventsListContainer}>
            <ul className={styles.ul}>
                {events?.length && events.map(event => (
                    <li key={event.id} className={styles.li}>
                        <Link href={`/events${event.slug.startsWith('/') ? event.slug : `/${event.slug}`}`}
                            className={styles.anchor}>
                            <div className={styles.dateTimeContainer}>
                                <p>&gt;</p>
                                <p>{moment(event.date).format('MMM Do, YYYY')}</p>
                                <p>{event.time}</p>
                            </div>
                            <div className={styles.detailsContainer}>
                                {event.featuredImageSrc && (
                                    <div className={styles.featuredImageContainer}>
                                        <Image src={event.featuredImageSrc}
                                            alt={`${event.title} featured image`}
                                            className={styles.featuredImage}
                                            width={260}
                                            height={146}
                                            priority />
                                    </div>
                                )}
                                <div className={styles.contentContainer}>
                                    <h4 className={styles.h4}>{event.title}</h4>
                                    <p className={styles.paragraph}>{event.excerpt} [...]</p>
                                    <div className={styles.locationDetailsContainer}>
                                        <PiMapPinLight color="#de78ed" size={24} />
                                        <p className={styles.address}>{event.address || 'Location TBA'}</p>
                                    </div>
                                    {/*<div className="map-point">*/}
                                    {/* google mappoint embed */}
                                    {/*<iframe*/}
                                    {/*    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.1194975626195!2d-122.1912779!3d37.8106699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f8771321144b7%3A0x859ee7b9ab6aeea3!2sCalifornia%20Writers%20Circle!5e0!3m2!1sen!2sus!4v1722102459999!5m2!1sen!2sus"*/}
                                    {/*    width="600" height="450" allowFullScreen loading="lazy"*/}
                                    {/*    referrerPolicy="no-referrer-when-downgrade" className={styles.iframe}></iframe>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </Link>
                    </li>
                )) || <li className={styles.li}>
                    <div className={styles.dateTimeContainer}>
                        <p>&gt;</p>
                    </div>
                    <div className={styles.detailsContainer}>
                        <div className={styles.contentContainer}>
                            <h4 className={styles.h4}>No upcoming events</h4>
                            <p className={styles.paragraph}>
                                Sign up for our newsletter to get the latest updates.{' '}
                                <Link href="/#sign-up">☝🏽</Link>
                            </p>
                        </div>
                    </div>
                </li>}
            </ul>
        </div>
    );
};
