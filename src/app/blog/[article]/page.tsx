import { ReactNode } from 'react';
import DOMPurify from 'isomorphic-dompurify';

import { Post } from '@data-types/types';
import { getPost } from '@utils/api/wp-actions';
import { Article } from '@components/post/article';

const BlogArticle = async (): Promise<ReactNode> => {
    const article: Post = await getPost('/code-of-conduct');

    return (
        <Article title={article.title}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || '') }}></div>
        </Article>
    );
};

export default BlogArticle;
