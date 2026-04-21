// src/utils/api/wp-actions.ts
"use server";

import { WhereClause } from "@data-types/types";
import { CursorInfo } from "@data-types/types";
import { PostEdges } from "@data-types/types";
import { PageInfo } from "@data-types/types";
import { QueryString } from "@data-types/types";
import { DataResponse } from "@data-types/types";
import { Post } from "@data-types/types";

const getWordPressApiUrl = (): string => {
    const wordpressApiUrl = process.env.WORDPRESS_API_URL?.trim();

    if (!wordpressApiUrl) {
        throw new Error(
            "WORDPRESS_API_URL is not configured. Add it to .env.local or the runtime environment.",
        );
    }

    return wordpressApiUrl;
};

const getQuery = async (postQuery: string, uri: string = ""): Promise<Response> => {
    const variables = {
        uri,
    };

    const res = await fetch(getWordPressApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        next: {
            revalidate: 60,
        },
        body: JSON.stringify({ query: postQuery, variables }),
    });

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    return res;
};

// Take a filter param to filter projects?
export const getPosts = async (
    filter: WhereClause = {},
    first: number = 10,
    cursorInfo?: CursorInfo,
): Promise<{ posts: PostEdges[]; pageInfo: PageInfo; }> => {
    // Filter the list by projects
    const postsQuery: QueryString = `query WPAllPostQuery {
      posts(
        first: ${first},
        before: "${cursorInfo?.before || null}",
        after: "${cursorInfo?.after || null}",
        where: {
          orderby: {field: DATE, order: DESC},
          tagId: "${filter.tag || ""}",
          categoryName: "${filter.category || ""}"
        }
      ) {
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
        edges {
          post: node {
            categories {
              nodes {
                name
              }
            }
            featuredImage {
              node {
                altText
                sourceUrl
                sizes
              }
            }
            databaseId
            date
            excerpt(format: RENDERED)
            eventsFields {
              address
              eventDateTime
              ticketLink
            }
            tags {
              nodes {
                name
              }
            }
            title(format: RENDERED)
            uri
          }
        }
      }
    }`;

    const res = await getQuery(postsQuery);

    const { data }: DataResponse = await res.json();

    // There's a bug in WPGraphQL where it sometimes returns null values for both cursors
    // if (!data?.posts?.pageInfo?.hasNextPage && !data?.posts?.pageInfo?.hasPreviousPage) {
    //     return await getPosts();
    // }

    // INTERCEPT AND SANITIZE: Strip the forced UTC timezone from WPGraphQL
    const cleanEdges = (data?.posts?.edges || []).map((edge: PostEdges) => {
        if (edge.post?.eventsFields?.eventDateTime) {
            edge.post.eventsFields.eventDateTime = edge.post.eventsFields.eventDateTime.replace("+00:00", "");
        }
        return edge;
    });

    return {
        posts: cleanEdges,
        pageInfo: data?.posts?.pageInfo || {
            hasNextPage: false,
            endCursor: null,
            hasPreviousPage: false,
            startCursor: null,
        },
    };
};

export const getPost = async (uri: string): Promise<Post> => {
    const postQuery: QueryString = `query WPPostQuery {
            post(id: "${uri}", idType: SLUG) {
                content(format: RENDERED)
                date
                featuredImage {
                  node {
                    altText
                    sourceUrl
                  }
                }
                title
                eventsFields {
                  address
                  eventDateTime
                  ticketLink
                }
              }
            }`;

    const res = await getQuery(postQuery, uri);

    const { data } = await res.json();
    const post = data?.post || {};

    // INTERCEPT AND SANITIZE: Strip the forced UTC timezone from WPGraphQL
    if (post?.eventsFields?.eventDateTime) {
        post.eventsFields.eventDateTime = post.eventsFields.eventDateTime.replace("+00:00", "");
    }

    return post;
};
