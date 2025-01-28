import { ReactNode } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';
import moment from 'moment';

import '@components/shared/styles/content.styles.css';
import styles from './event.module.css';
import { getPost } from '@utils/api/wp-actions';
import { getPosts } from '@utils/api/wp-actions';
import { PostEdges } from '@data-types/types';
import { Post } from '@data-types/types';
import { BackButton } from '@components/utils/back-button/back-button';
import { IoTicketOutline } from 'react-icons/io5';
import { EventLocation } from '@components/location/event-location';

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
                    <EventLocation address={eventData.eventsFields?.address || 'TBA'} />
                    <p className={styles.paragraph}>
                        {moment(eventData.eventsFields?.eventDateTime).format('MMMM Do, YYYY')}
                    </p>
                    <p className={styles.paragraph}>{moment(eventData.eventsFields?.eventDateTime).format('h:mm A')}</p>
                </div>
                {eventData.featuredImage && (
                    <div className={styles.featuredImageContainer}>
                        <Image src={eventData.featuredImage.node.sourceUrl}
                            alt={eventData.featuredImage.node.altText ?? `Featured Banner for ${eventData.title}`}
                            className={styles.featuredImage}
                            width={1920}
                            height={1080}
                            quality={85}
                            priority />
                    </div>
                )}
            </div>
            <article className={styles.eventDetailsSection}>
                <div className={styles.ticketingDetailsContainer}>
                    <h3 className={styles.h3}>Details</h3>
                    {eventData.eventsFields?.ticketLink && (
                        <a className={styles.ticketingLink}
                            href={eventData.eventsFields?.ticketLink}
                            target="_blank"
                            rel="noopener">
                            <IoTicketOutline color="#8888dd" className={styles.ticketIcon} />
                            <p>Tickets</p>
                        </a>
                    )}
                </div>
                <div className={`${styles.eventContentSection}`}>
                    {eventData.featuredImage && (
                        <div className={styles.contentImageContainer}>
                            <Image src={eventData.featuredImage.node.sourceUrl}
                                alt={`${eventData.title} featured image`}
                                className={styles.contentImage}
                                width={1920}
                                height={1080}
                                quality={85}
                                priority
                            />
                        </div>
                    )}
                    <div
                        className={`${styles.eventContent} post-content`}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(eventData.content || '') }}
                    />
                </div>
                <BackButton>← Back</BackButton>
            </article>
        </>
    );
};

export default EventPage;
