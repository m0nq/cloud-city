import { ReactNode } from 'react';
import { ReactElement } from 'react';
import Image from 'next/image';
import moment from 'moment';

import '@components/shared/styles/content.styles.css';

export const Article = ({
    title,
    children,
    date,
    featuredImage = ''
}: {
    title: string;
    date?: string;
    children: ReactNode;
    featuredImage?: string;
}): ReactElement => {
    return (
        <article className="post">
            <h1 className="post-title">{title}</h1>
            {featuredImage && (
                <Image src={featuredImage}
                    alt={featuredImage}
                    width={1920}
                    height={280}
                    className="featuredImage" />
            )}
            {date && <div className="posted-on">Posted on {moment(date).format('MMMM Do, YYYY')}</div>}
            <div className="post-content">
                {children}
            </div>
        </article>
    );
};
