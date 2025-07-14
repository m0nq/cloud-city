import { PiMapPinLight } from 'react-icons/pi';
import moment from 'moment-timezone';
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
                    const now = moment().tz('America/Los_Angeles');
                    const upcomingEvents = events.filter(({ post: event }) => {
                        const eventDateTime = moment.tz(event.eventsFields?.eventDateTime, 'America/Los_Angeles');
                        return eventDateTime.isSameOrAfter(now, 'day');
                    });

                    setEvents(upcomingEvents);
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
                                        <p>{moment.tz(event.eventsFields?.eventDateTime, 'America/Los_Angeles').format('MMM Do, YYYY')}</p>
                                        <p>{moment.tz(event.eventsFields?.eventDateTime, 'America/Los_Angeles').format('h:mm A')}</p>
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
                                                <p className={styles.address}>{event.eventsFields?.address || 'TBA'}</p>
                                            </div>
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
