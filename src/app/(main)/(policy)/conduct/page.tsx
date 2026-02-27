import { ReactNode } from 'react';

import { Post } from '@data-types/types';
import { getPost } from '@utils/api/wp-actions';
import { Article } from '@components/post/article';
import { sanitizeContent } from '@utils/html-sanitizer';

const CodeOfConduct = async (): Promise<ReactNode> => {
    // get code of conduct post from wp-actions
    const codeOfConduct: Post = await getPost('/code-of-conduct');

    return (
        <Article title={codeOfConduct.title}>
            <div dangerouslySetInnerHTML={{ __html: sanitizeContent(codeOfConduct.content || '') }}></div>
        </Article>
    );
};

export default CodeOfConduct;
