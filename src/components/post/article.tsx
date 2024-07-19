import { ReactNode } from 'react';
import { ReactElement } from 'react';
import moment from 'moment';

import './article.styles.css';

export const Article = ({ title, children, date }: {
    title: string,
    date?: string,
    children: ReactNode
}): ReactElement => {

    return (
        <article className="post">
            <h1 className="post-title">{title}</h1>
            {date && <div className="posted-on">Posted on {moment(date).format('MMMM Do, YYYY')}</div>}
            <article className="post-content">
                {children}
                <br />
            </article>
        </article>
    );
};
