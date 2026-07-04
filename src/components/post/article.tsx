// src/components/post/article.tsx
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
                <div className="featuredImageWrapper">
                    <Image
                        src={featuredImage}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="featuredImage"
                        loading="eager"
                    />
                </div>
            )}
            {date && <div className="posted-on">Posted on {moment(date).format('MMMM Do, YYYY')}</div>}
            <div className="post-content">{children}</div>
        </article>
    );
};
