import { getPost } from '@utils/api/wp-actions';
import { Article } from '@components/post/article';
import { Post } from '@data-types/types';
import { sanitizeContent } from '@utils/html-sanitizer';

export const dynamic = 'force-dynamic';

const PrivacyPolicy = async () => {
    let title = 'Privacy Policy';
    let content = '<p>The privacy policy is temporarily unavailable. Please try again shortly.</p>';

    try {
        // get privacy policy post from wp-actions
        const privacyPolicy: Post = await getPost('/privacy-policy');
        title = privacyPolicy.title || title;
        content = privacyPolicy.content || content;
    } catch (error) {
        console.error('[policy/privacy-policy] Failed to load privacy policy:', error);
    }

    return (
        <Article title={title}>
            <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content) }}></div>
        </Article>
    );
};

export default PrivacyPolicy;
