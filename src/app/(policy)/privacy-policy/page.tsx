import DOMPurify from 'isomorphic-dompurify';

import { getPost } from '@utils/api/wp-actions';
import { Article } from '@components/post/article';
import { Post } from '@data-types/types';

const PrivacyPolicy = async () => {
    // get privacy policy post from wp-actions
    const privacyPolicy: Post = await getPost('/privacy-policy');

    return (
        <Article title={privacyPolicy.title}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(privacyPolicy.content || '') }}></div>
        </Article>
    );
};

export default PrivacyPolicy;
