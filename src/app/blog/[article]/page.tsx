import { ReactNode } from 'react';
import Image from 'next/image';
import DOMPurify from 'isomorphic-dompurify';

import { Post } from '@data-types/types';
import { getPost } from '@utils/api/wp-actions';
import { getPosts } from '@utils/api/wp-actions';
import { Article } from '@components/post/article';
import { Section } from '@components/utils/section';

export const generateStaticParams = async (): Promise<{ article: string }[]> => {
    const { posts } = await getPosts({ tag: 'Cloud City', category: 'Blog' }, 100);

    return posts.map(({ post }) => ({
        // Remove leading and trailing slashes and get the last segment
        article: post.uri.split('/').filter(Boolean).pop() || ''
    }));
};

const BlogArticle = async ({ params }: { params: Promise<{ article: string }> }): Promise<ReactNode> => {
    const { article } = await params;
    // Reconstruct the URI with leading slash
    const articleData: Post = await getPost(`/${article}`);

    if (!articleData) {
        return <div>Article not found</div>;
    }

    return (
        <>
            {articleData.featuredImage && (
                <Section className="relative p-0 h-auto w-full">
                    <Image src={articleData.featuredImage.node.sourceUrl}
                        alt={articleData.featuredImage.node.altText}
                        width={1920}
                        height={176}
                        className="w-full max-h-[280px] object-cover blur-md" />
                </Section>
            )}
            <Article title={articleData.title}
                date={articleData.date}
                featuredImage={articleData.featuredImage?.node.sourceUrl}>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleData.content || '') }}></div>
            </Article>
        </>
    );
};

export default BlogArticle;
