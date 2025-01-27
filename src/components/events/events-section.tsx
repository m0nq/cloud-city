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

    if (isLoading) {
        return (
            <section className={styles.eventsContainer}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.h2}>Events</h2>
                </div>
                <div className={styles.descriptionContainer}>
                    <p className={styles.descriptionParagraph}>Loading events. Hold my NA beer... 🍻</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.eventsContainer}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.h2}>Events</h2>
                </div>
                <div className={styles.descriptionContainer}>
                    <p className={styles.descriptionParagraph}>{error}</p>
                </div>
            </section>
        );
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
            <EventsList events={events} />
        </section>
    );
};
