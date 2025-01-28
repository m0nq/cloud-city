import { ReactNode } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import moment from 'moment';
import { PiMapPinLight } from 'react-icons/pi';

import styles from './event.module.css';
import { getPost } from '@utils/api/wp-actions';
import { getPosts } from '@utils/api/wp-actions';
import { PostEdges } from '@data-types/types';
import { Post } from '@data-types/types';
import { Article } from '@components/post/article';
import { BackButton } from '@components/utils/back-button/back-button';

export const generateStaticParams = async (): Promise<{ event: string }[]> => {
    const { posts: events }: { posts: PostEdges[] } = await getPosts({ tag: 'Cloud City', category: 'Events' }, 100);

    return events.map(({ post }: PostEdges) => ({
        event: post.uri.split('/').filter(Boolean).pop() || ''
    }));
};

const EventPage = async ({ params }: { params: Promise<{ event: string }> }): Promise<ReactNode> => {

    const { event } = await params;
    const eventData: Post = await getPost(event);

    if (!eventData) {
        return <div>Event not found</div>;
    }

    return (
        <>
            <div className={styles.bannerSection}>
                <h1 className={styles.h1}>{eventData.title}</h1>
                <div className={styles.eventDetailsContainer}>
                    <div className={styles.locationDetailsContainer}>
                        <PiMapPinLight color="#de78ed" className={styles.mapPin} />
                        <p className={styles.address}>{eventData.eventsFields?.address || 'Location TBA'}</p>
                    </div>
                    <p className={styles.paragraph}>{moment(eventData.eventsFields?.eventDateTime).format('MMMM Do, YYYY')}</p>
                    <p className={styles.paragraph}>{moment(eventData.eventsFields?.eventDateTime).format('h:mm A')}</p>
                </div>
                {eventData.featuredImage && (
                    <div className={styles.featuredImageContainer}>
                        <Image
                            src={eventData.featuredImage.node.sourceUrl}
                            alt={`${eventData.title} featured image`}
                            className={styles.featuredImage}
                            width={1920}
                            height={1080}
                            quality={85}
                            priority
                        />
                    </div>
                )}
            </div>
            <Article title={eventData.title}
                date={eventData.eventsFields?.eventDateTime}
                featuredImage={eventData.featuredImage?.node.sourceUrl}>
                <div className="event-details">
                    <div className="posted-on">
                        Event
                        Date: {moment(eventData.eventsFields?.eventDateTime).format('MMMM Do, YYYY')} at {moment(eventData.eventsFields?.eventDateTime).format('HH:mm')}
                    </div>
                    <div className="post-content">
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(eventData.content || '') }} />
                        <div className="event-location">
                            <h3>Location</h3>
                            <p>{eventData.eventsFields?.address}</p>
                        </div>
                    </div>
                </div>
                <BackButton>← Back</BackButton>
            </Article>
        </>
    );
};

export default EventPage;
