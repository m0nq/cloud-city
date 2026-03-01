import { ReactNode } from 'react';

import { Post } from '@data-types/types';
import { getPost } from '@utils/api/wp-actions';
import { Article } from '@components/post/article';
import { sanitizeContent } from '@utils/html-sanitizer';

export const dynamic = 'force-dynamic';

const CodeOfConduct = async (): Promise<ReactNode> => {
    let title = 'Code of Conduct';
    let content = '<p>The code of conduct is temporarily unavailable. Please try again shortly.</p>';

    try {
        // get code of conduct post from wp-actions
        const codeOfConduct: Post = await getPost('/code-of-conduct');
        title = codeOfConduct.title || title;
        content = codeOfConduct.content || content;
    } catch (error) {
        console.error('[policy/conduct] Failed to load code of conduct:', error);
    }

    return (
        <Article title={title}>
            <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content) }}></div>
        </Article>
    );
};

export default CodeOfConduct;
