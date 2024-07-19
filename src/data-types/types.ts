export type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    other: string;
}

export type QueryString = string;

export type CursorInfo = {
    before?: CursorType;
    after?: CursorType;
}

export type CursorType = string | null;

export type PageInfo = {
    hasNextPage: boolean;
    endCursor: CursorType;
    hasPreviousPage: boolean;
    startCursor: CursorType;
}

export type WhereClause = {
    tag?: string;
    category?: string;
}

export type PostResult = {
    edges: PostEdges[];
    pageInfo: PageInfo;
};

export type DataResponse = {
    data: {
        posts: PostResult;
    };
};

export type PostEdges = {
    post: Post;
};

export type Post = {
    excerpt?: string;
    content?: string;
    date: string;
    databaseId: number;
    featuredImage?: {
        node: {
            altText: string;
            link: string;
            slug: string;
            srcSet: string;
            sourceUrl: string;
        };
    };
    uri: string;
    title: string;
    categories?: {
        nodes: {
            name: string;
        }[];
    };
};

// export interface Props {
//     params?: { id: string };
//     searchParams?: { [key: string]: string | string[] | undefined };
//     children?: ReactNode;
// }
//
// export type EmailResponse = {
//     success?: boolean;
//     isPending?: boolean;
//     errors?: { message: any };
//     response?: any;
// }
