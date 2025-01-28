import { EventsList } from './events-list';
import styles from './events-section.module.css';

const EventsSection = () => {
    return (
        <section className={styles.eventsContainer}>
            <div className={styles.titleContainer}>
                <h2 className={styles.h2}>Events</h2>
            </div>
            <div className={styles.descriptionContainer}>
                <h3 className={styles.h3}>Gatherings</h3>
                <p className={styles.descriptionParagraph}>
                    Transforming alcohol-free events into unforgettable real-world experiences. From curating vibrant
                    spaces at festivals to hosting our own signature gatherings, we bring people together through
                    connection, creativity, and celebration. Come through!
                </p>
            </div>
            <EventsList />
        </section>
    );
};

export default EventsSection;
