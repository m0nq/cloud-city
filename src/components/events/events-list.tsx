import { PiMapPinLight } from 'react-icons/pi';
import moment from 'moment';
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';

import styles from './events-section.module.css';
import { PostEdges } from '@data-types/types';
import { getPosts } from '@utils/api/wp-actions';

export const EventsList = () => {
    const [events, setEvents] = useState<PostEdges[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();

        (async () => {
            try {
                const { posts: events } = await getPosts({ tag: 'Cloud City', category: 'Events' }, 10);

                if (mounted) {
                    setEvents(events);
                }
            } catch (err) {
                if (mounted) {
                    setError('I couldn\'t load the events for some reason. Try refreshing the page.');
                    console.error('Error fetching events:', err);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            mounted = false;
            abortController.abort();
        };
    }, []);

    if (error) {
        console.error('Error fetching events:', error);
    }

    return (
        <>
            {isLoading ? (
                <div className={styles.eventsListContainer}>
                    <ul className={styles.ul}>
                        <li className={styles.li}>
                            <div className={styles.anchor}>
                                <div className={styles.dateTimeContainer}>
                                    <div className="h-6 w-6 md:h-8 md:w-8 animate-pulse rounded-lg bg-gray-200" />
                                    <div className="h-6 w-32 md:h-8 md:w-40 animate-pulse rounded-lg bg-gray-200" />
                                    <div className="h-6 w-24 md:h-8 md:w-32 animate-pulse rounded-lg bg-gray-200" />
                                </div>
                                <div className={styles.detailsContainer}>
                                    <div
                                        className="hidden sm:block w-full max-w-[500px] aspect-[16/9] animate-pulse rounded-3xl bg-gray-200" />
                                    <div className={styles.contentContainer}>
                                        <div className="h-8 w-3/4 md:h-12 animate-pulse rounded-lg bg-gray-200 mt-3" />
                                        <div className="space-y-3 mt-4 w-full">
                                            <div className="h-5 w-full animate-pulse rounded-lg bg-gray-200" />
                                            <div className="h-5 w-full animate-pulse rounded-lg bg-gray-200" />
                                        </div>
                                        <div className="flex items-center gap-2 mt-4">
                                            <div className="h-6 w-6 animate-pulse rounded-lg bg-gray-200" />
                                            <div className="h-6 w-48 animate-pulse rounded-lg bg-gray-200" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            ) : error ? (
                <div>
                    <p>There was a problem loading the events. Reload the page to try again.</p>
                </div>
            ) : (
                <div className={styles.eventsListContainer}>
                    <ul className={styles.ul}>
                        {events?.length && events.map(({ post: event }: PostEdges) => (
                            <li key={event.databaseId} className={styles.li}>
                                <Link href={`/events/${event.uri}`}
                                    className={styles.anchor}>
                                    <div className={styles.dateTimeContainer}>
                                        <p>&gt;</p>
                                        <p>{moment(event.eventsFields?.eventDateTime).format('MMM Do, YYYY')}</p>
                                        <p>{moment(event.eventsFields?.eventDateTime).format('h:mm A')}</p>
                                    </div>
                                    <div className={styles.detailsContainer}>
                                        {event.featuredImage && (
                                            <div className={styles.featuredImageContainer}>
                                                <Image src={event.featuredImage.node.sourceUrl}
                                                    alt={`${event.title} featured image`}
                                                    className={styles.featuredImage}
                                                    width={260}
                                                    height={146}
                                                    quality={85}
                                                    priority />
                                            </div>
                                        )}
                                        <div className={styles.contentContainer}>
                                            <h4 className={styles.h4}>{event.title}</h4>
                                            <div className={styles.paragraph}
                                                dangerouslySetInnerHTML={{ __html: event.excerpt || '' }} />
                                            <div className={styles.locationDetailsContainer}>
                                                <PiMapPinLight color="#de78ed" size={24} />
                                                <p className={styles.address}>{event.eventsFields?.address || 'Location TBA'}</p>
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
                                        Sign up for our newsletter to get the latest.{' '}
                                        <Link href="/#sign-up">☝🏽</Link>
                                    </p>
                                </div>
                            </div>
                        </li>}
                    </ul>
                </div>
            )}
        </>
    );
};
