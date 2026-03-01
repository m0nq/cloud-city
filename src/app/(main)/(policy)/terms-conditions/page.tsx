import { ReactElement } from 'react';

import { getPost } from '@utils/api/wp-actions';
import { Article } from '@components/post/article';
import { Post } from '@data-types/types';
import { sanitizeContent } from '@utils/html-sanitizer';

export const dynamic = 'force-dynamic';

const TermsAndConditions = async (): Promise<ReactElement> => {
    let title = 'Terms and Conditions';
    let content = '<p>The terms and conditions are temporarily unavailable. Please try again shortly.</p>';

    try {
        // get terms and conditions post from wp-actions
        const termsAndConditions: Post = await getPost('/terms-and-conditions');
        title = termsAndConditions.title || title;
        content = termsAndConditions.content || content;
    } catch (error) {
        console.error('[policy/terms-conditions] Failed to load terms and conditions:', error);
    }

    return (
        <Article title={title}>
            <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content) }}></div>
        </Article>
    );
};

export default TermsAndConditions;
