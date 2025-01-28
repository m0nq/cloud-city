import { ReactNode } from 'react';
import DOMPurify from 'isomorphic-dompurify';

import { getPost } from '@utils/api/wp-actions';
import { getPosts } from '@utils/api/wp-actions';
import { PostEdges } from '@data-types/types';
import { Post } from '@data-types/types';
import { Article } from '@components/post/article';
import moment from 'moment';
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
        <Article title={eventData.title}
            date={eventData.eventsFields?.eventDateTime}
            featuredImage={eventData.featuredImage?.node.sourceUrl}>
            <div className="event-details">
                <div className="posted-on">
                    Event
                    Date: {moment(eventData.eventsFields?.eventDateTime).format('MMMM Do, YYYY')} at {moment(eventData.eventsFields?.eventDateTime).format('HH:mm')}
                </div>
                <div className="post-content">
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(eventData.content || '') }}></div>
                    <div className="event-location">
                        <h3>Location</h3>
                        <p>{eventData.eventsFields?.address}</p>
                    </div>
                </div>
            </div>
            <BackButton>← Back</BackButton>
        </Article>
    );
};

export default EventPage;
