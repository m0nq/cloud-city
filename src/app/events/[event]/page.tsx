// src/app/events/[event]/page.tsx
import { ReactNode } from "react";
import Image from "next/image";
import moment from "moment-timezone";

import "@components/shared/styles/content.styles.css";
import styles from "./event.module.css";
import { getPost } from "@utils/api/wp-actions";
import { getPosts } from "@utils/api/wp-actions";
import { PostEdges } from "@data-types/types";
import { Post } from "@data-types/types";
import { BackButton } from "@components/utils/back-button/back-button";
import { EventLocation } from "@components/location/event-location";
import { sanitizeContent } from "@utils/html-sanitizer";
import { TicketLink } from "@components/events/ticket-link";

export const generateStaticParams = async (): Promise<{ event: string }[]> => {
    try {
        const { posts: events }: { posts: PostEdges[] } = await getPosts({
            tag: "Cloud City",
            category: "Events",
        }, 100);

        return events.map(({ post }: PostEdges) => ({
            event: post.uri.split("/").filter(Boolean).pop() || "",
        }));
    } catch (error) {
        console.error("[events/[event]] Failed to generate static params:", error);
        return [];
    }
};

const EventPage = async ({ params }: { params: Promise<{ event: string }> }): Promise<ReactNode> => {
    const { event } = await params;
    const eventData: Post = await getPost(event);

    if (!eventData?.title) {
        return <div>Event not found</div>;
    }

    return (
        <>
            <div className={styles.bannerSection}>
                <h1 className={styles.h1}>{eventData.title}</h1>
                <div className={styles.eventDetailsContainer}>
                    <EventLocation address={eventData.eventsFields?.address || "TBA"} />
                    <p className={styles.paragraph}>
                        {moment.tz(eventData.eventsFields?.eventDateTime, "America/Los_Angeles").format("MMMM Do, YYYY")}
                    </p>
                    <p className={styles.paragraph}>{moment.tz(eventData.eventsFields?.eventDateTime, "America/Los_Angeles").format("h:mm A")} (PT)</p>
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
                    <TicketLink href={eventData.eventsFields?.ticketLink} />
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
                        dangerouslySetInnerHTML={{ __html: sanitizeContent(eventData.content || "") }}
                    />
                </div>
                <BackButton>← Back</BackButton>
            </article>
        </>
    );
};

export default EventPage;
