import { ReactElement } from 'react';

import { Post } from '@data-types/types';
import { getPost } from '@utils/api/wp-actions';
import { Article } from '@components/post/article';
import DOMPurify from 'isomorphic-dompurify';

const CodeOfConduct = async (): Promise<ReactElement> => {
    // get code of conduct post from wp-actions
    const codeOfConduct: Post = await getPost('/code-of-conduct');

    return (
        <Article title={codeOfConduct.title}>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(codeOfConduct.content || '') }}></div>
        </Article>
    );
};

export default CodeOfConduct;
