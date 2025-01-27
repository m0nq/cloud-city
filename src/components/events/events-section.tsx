import { useState } from 'react';
import { useEffect } from 'react';

import { EventsList } from './events-list';
import styles from './events-section.module.css';
import { FlattenedEvent } from '@data-types/types';

export const EventsSection = () => {
    const [events, setEvents] = useState<FlattenedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();

        (async () => {
            try {
                const { events } = (await (await fetch('/api/events')).json());

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
                <div className="w-full">
                    <div className={styles.titleContainer}>
                        <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
                    </div>
                    <div className={styles.descriptionContainer}>
                        <div className="h-24 w-full animate-pulse rounded-lg bg-gray-200 xl:w-1/2" />
                        <div className="h-32 w-full space-y-2 xl:w-1/2">
                            <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
                            <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
                            <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-200" />
                        </div>
                    </div>
                    <div className={styles.eventsListContainer}>
                        <ul className={styles.ul}>
                            {[1, 2].map(i => (
                                <li key={i} className={styles.li}>
                                    <div className="flex w-full flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-6 w-6 animate-pulse rounded-lg bg-gray-200" />
                                            <div className="h-6 w-32 animate-pulse rounded-lg bg-gray-200" />
                                        </div>
                                        <div className="flex w-full flex-col gap-4 lg:flex-row">
                                            <div className="h-[146px] w-[260px] animate-pulse rounded-lg bg-gray-200" />
                                            <div className="flex-1 space-y-4">
                                                <div className="h-8 w-3/4 animate-pulse rounded-lg bg-gray-200" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
                                                    <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 animate-pulse rounded-lg bg-gray-200" />
                                                    <div className="h-6 w-48 animate-pulse rounded-lg bg-gray-200" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : error ? (
                <div>
                    <p>{error}</p>
                </div>
            ) : <EventsList events={events} />}
        </section>
    );
};
