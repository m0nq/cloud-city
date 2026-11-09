// src/app/events/[event]/page.tsx
import { cache, ReactNode } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import moment from 'moment-timezone';

import '@components/shared/styles/content.styles.css';
import styles from './event.module.css';
import { getPost } from '@utils/api/wp-actions';
import { getPosts } from '@utils/api/wp-actions';
import { PostEdges } from '@data-types/types';
import { Post } from '@data-types/types';
import { BackButton } from '@components/utils/back-button/back-button';
import { EventLocation } from '@components/location/event-location';
import { sanitizeContent } from '@utils/html-sanitizer';
import { TicketLink } from '@components/events/ticket-link';
import { resolveHeroTone } from '@utils/hero-tone';
import { buildEventMetadata } from '@utils/event-metadata';

const getEvent = cache((uri: string) => getPost(uri));

const getSafeImageDimensions = (
    mediaDetails?: {
        width?: number | null;
        height?: number | null;
    } | null
): { width: number; height: number } => {
    const width = mediaDetails?.width;
    const height = mediaDetails?.height;

    if (
        typeof width === 'number' &&
        Number.isFinite(width) &&
        width > 0 &&
        typeof height === 'number' &&
        Number.isFinite(height) &&
        height > 0
    ) {
        return { width, height };
    }

    return { width: 1920, height: 1080 };
};

export const generateStaticParams = async (): Promise<{ event: string }[]> => {
    try {
        const { posts: events }: { posts: PostEdges[] } = await getPosts(
            { tag: 'Cloud City', category: 'Events' },
            100
        );

        return events.map(({ post }: PostEdges) => ({
            event: post.uri.split('/').filter(Boolean).pop() || ''
        }));
    } catch (error) {
        console.error('[events/[event]] Failed to generate static params:', error);
        return [];
    }
};

export const generateMetadata = async ({
    params
}: {
    params: Promise<{ event: string }>;
}): Promise<Metadata> => {
    const { event } = await params;

    try {
        return buildEventMetadata(await getEvent(event));
    } catch (error) {
        console.error('[events/[event]] Failed to generate metadata:', error);
        return buildEventMetadata({});
    }
};

const EventPage = async ({ params }: { params: Promise<{ event: string }> }): Promise<ReactNode> => {
    const { event } = await params;
    const eventData: Post = await getEvent(event);

    if (!eventData?.title) {
        return <div>Event not found</div>;
    }

    const featuredImage = eventData.featuredImage?.node;
    const { width: imageWidth, height: imageHeight } = getSafeImageDimensions(featuredImage?.mediaDetails);

    const heroTone = await resolveHeroTone(
        eventData.eventsFields?.heroBackgroundTone,
        eventData.featuredImage?.node.sourceUrl
    );

    return (
        <>
            <div className={styles.bannerSection} data-hero-tone={heroTone}>
                <h1 className={styles.h1}>{eventData.title}</h1>
                <div className={styles.eventDetailsContainer}>
                    <EventLocation address={eventData.eventsFields?.address || 'TBA'} />
                    <p className={styles.paragraph}>
                        {moment
                            .tz(eventData.eventsFields?.eventDateTime, 'America/Los_Angeles')
                            .format('MMMM Do, YYYY')}
                    </p>
                    <p className={styles.paragraph}>
                        {moment.tz(eventData.eventsFields?.eventDateTime, 'America/Los_Angeles').format('h:mm A')} (PT)
                    </p>
                </div>
                {featuredImage && (
                    <div className={styles.featuredImageContainer}>
                        <Image
                            src={featuredImage.sourceUrl}
                            alt=""
                            className={styles.featuredImage}
                            width={imageWidth}
                            height={imageHeight}
                            quality={85}
                            priority
                        />
                    </div>
                )}
            </div>
            <article className={styles.eventDetailsSection}>
                <div className={styles.ticketingDetailsContainer}>
                    <h3 className={styles.h3}>Details</h3>
                    <TicketLink href={eventData.eventsFields?.ticketLink} />
                </div>
                <div className={`${styles.eventContentSection}`}>
                    {featuredImage && (
                        <div className={styles.contentImageContainer}>
                            <Image
                                src={featuredImage.sourceUrl}
                                alt={featuredImage.altText ?? ''}
                                className={styles.contentImage}
                                width={imageWidth}
                                height={imageHeight}
                                quality={85}
                                priority
                            />
                        </div>
                    )}
                    <div
                        className={`${styles.eventContent} post-content`}
                        dangerouslySetInnerHTML={{ __html: sanitizeContent(eventData.content || '') }}
                    />
                </div>
                <BackButton>← Back</BackButton>
            </article>
        </>
    );
};

export default EventPage;
