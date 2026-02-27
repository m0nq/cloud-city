import { ReactElement } from 'react';

import { getPost } from '@utils/api/wp-actions';
import { Article } from '@components/post/article';
import { Post } from '@data-types/types';
import { sanitizeContent } from '@utils/html-sanitizer';

const TermsAndConditions = async (): Promise<ReactElement> => {
    // get terms and conditions post from wp-actions
    const termsAndConditions: Post = await getPost('/terms-and-conditions');

    return (
        <Article title={termsAndConditions.title}>
            <div dangerouslySetInnerHTML={{ __html: sanitizeContent(termsAndConditions.content || '') }}></div>
        </Article>
    );
};

export default TermsAndConditions;
