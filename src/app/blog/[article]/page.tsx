import { ReactNode } from 'react';
import Image from 'next/image';

import { Post } from '@data-types/types';
import { getPost } from '@utils/api/wp-actions';
import { getPosts } from '@utils/api/wp-actions';
import { Article } from '@components/post/article';
import { Section } from '@components/utils/section';
import { sanitizeContent } from '@utils/html-sanitizer';

export const generateStaticParams = async (): Promise<{ article: string }[]> => {
    try {
        const { posts } = await getPosts({ category: 'Blog', tag: 'Cloud City' }, 100);

        return posts.map(({ post }) => ({
            // Remove leading and trailing slashes and get the last segment
            article: post.uri.split('/').filter(Boolean).pop() || ''
        }));
    } catch (error) {
        console.error('[blog/[article]] Failed to generate static params:', error);
        return [];
    }
};

const BlogArticle = async ({ params }: { params: Promise<{ article: string }> }): Promise<ReactNode> => {
    const { article } = await params;
    // Reconstruct the URI with leading slash
    const articleData: Post = await getPost(`/${article}`);

    if (!articleData?.title) {
        return <div>Article not found</div>;
    }

    return (
        <>
            {/*{articleData.featuredImage && (*/}
            {/*    <Section className="relative p-0 h-[421px] w-full">*/}
            {/*        <Image src={articleData.featuredImage.node.sourceUrl}*/}
            {/*            alt={articleData.featuredImage.node.altText}*/}
            {/*            width={1920}*/}
            {/*            height={280}*/}
            {/*            quality={85}*/}
            {/*            sizes="100vw"*/}
            {/*            priority*/}
            {/*            className="w-full h-full object-cover blur-[10px]" />*/}
            {/*    </Section>*/}
            {/*)}*/}
            <Article title={articleData.title}
                date={articleData.date}
                featuredImage={articleData.featuredImage?.node.sourceUrl}>
                <div dangerouslySetInnerHTML={{ __html: sanitizeContent(articleData.content || '') }}></div>
            </Article>
        </>
    );
};

export default BlogArticle;
