import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';

import styles from './blog.module.css';
import { getPosts } from '@utils/api/wp-actions';
import { Post } from '@data-types/types';

const Blog = async () => {
    const { posts, pageInfo } = await getPosts({ tag: 'Cloud City', category: 'Blog' }, 100);

    return (
        <div className={styles.blogContainer}>
            <header className={styles.titleContainer}>
                <h1 className={styles.blogTitle}>Articles</h1>
            </header>
            <section className={styles.blogList}>
                {posts.length && posts?.map(({ post }: { post: Post }) => (
                    <Link key={post.databaseId} href={`/blog${post.uri.startsWith('/') ? post.uri : `/${post.uri}`}`}>
                            <div className={styles.blogCardContainer}>
                                {post.featuredImage && (
                                    <div className={styles.imageContainer}>
                                    <Image src={post.featuredImage.node.sourceUrl}
                                            alt={post.featuredImage.node.altText || 'Blog featured image'}
                                            sizes={post.featuredImage.node.sizes}
                                            className={styles.featuredImage}
                                            width={280}
                                            height={170}
                                            loading="lazy"
                                            quality={75} />
                                    </div>
                                )}
                                <div className={styles.blogCardContent}>
                                    <div className={styles.blogDate}>
                                        <p>
                                            <span>&gt; </span>
                                            {moment(post.date).format('MMMM Do, YYYY')}
                                        </p>
                                    </div>
                                    <h2 className={styles.h2}>{post.title}</h2>
                                    <div dangerouslySetInnerHTML={{ __html: post.excerpt || '' }}></div>
                                </div>
                            </div>
                        </Link>
                )) || (
                    <div className={styles.blogList}>Soon...</div>
                )}
            </section>
            <nav className="pagination-wrapper">
                <div>
                    {pageInfo?.hasPreviousPage && (
                        <button className="font-body" onClick={async () => {
                                return await getPosts({}, 10, { before: pageInfo?.startCursor });
                            }}>
                            ← Newer Posts
                        </button>
                    )}
                </div>
                <div>
                    {pageInfo?.hasNextPage && (
                        <button className="font-body" onClick={async () => {
                                return await getPosts({}, 10, { after: pageInfo?.startCursor });
                            }}>
                            Older Posts →
                        </button>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Blog;
