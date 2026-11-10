import type { Metadata } from 'next';
import sanitizeHtml from 'sanitize-html';

import type { Post } from '@data-types/types';

export const EVENT_METADATA_FALLBACK_DESCRIPTION = 'Event details and updates.';
const APPROVED_MEDIA_ORIGIN = 'https://cirquitree.com';

const toPlainText = (value: unknown): string =>
    sanitizeHtml(typeof value === 'string' ? value : '', {
        allowedTags: [],
        allowedAttributes: {}
    })
        .replace(/\s+/g, ' ')
        .trim();

const getApprovedImageUrl = (value: unknown): string | undefined => {
    if (typeof value !== 'string') {
        return undefined;
    }

    const imageUrl = value.trim();
    if (!imageUrl) {
        return undefined;
    }

    try {
        const parsedUrl = new URL(imageUrl);
        if (
            parsedUrl.protocol !== 'https:' ||
            parsedUrl.origin !== APPROVED_MEDIA_ORIGIN ||
            parsedUrl.username ||
            parsedUrl.password
        ) {
            return undefined;
        }

        return imageUrl;
    } catch {
        return undefined;
    }
};

export const buildEventMetadata = (
    event: Partial<Pick<Post, 'title' | 'featuredImage'>>
): Metadata => {
    const title = toPlainText(event.title) || 'Event details';
    const description = EVENT_METADATA_FALLBACK_DESCRIPTION;
    const imageUrl = getApprovedImageUrl(event.featuredImage?.node?.sourceUrl);
    const imageAlt = toPlainText(event.featuredImage?.node?.altText) || title;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            ...(imageUrl ? { images: [{ url: imageUrl, alt: imageAlt }] } : {})
        },
        twitter: {
            card: imageUrl ? 'summary_large_image' : 'summary',
            title,
            description,
            ...(imageUrl ? { images: [imageUrl] } : {})
        }
    };
};
