import { useState } from 'react';
import { useEffect } from 'react';

import { EventsList } from './events-list';
import styles from './events-section.module.css';
import { PostEdges } from '@data-types/types';
import { getPosts } from '@utils/api/wp-actions';

const EventsSection = () => {
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
        <section className={styles.eventsContainer}>
            <div className={styles.titleContainer}>
                <h2 className={styles.h2}>Events</h2>
            </div>
            <div className={styles.descriptionContainer}>
                <h3 className={styles.h3}>Gatherings</h3>
                <p className={styles.descriptionParagraph}>
                    Tranforming alcohol-free events into unforgettable real-world experiences. From curating vibrant
                    spaces at festivals to hosting our own signature gatherings, we bring people together through
                    connection, creativity, and celebration. Come through!
                </p>
            </div>
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
                <EventsList events={events} />
            )}
        </section>
    );
};

export default EventsSection;
