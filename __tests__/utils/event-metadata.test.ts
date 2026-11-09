import type { Post } from '@/data-types/types';
import { buildEventMetadata, EVENT_METADATA_FALLBACK_DESCRIPTION } from '@/utils/event-metadata';

describe('event metadata', () => {
    it('preserves a legitimate published title while using a neutral description', () => {
        const metadata = buildEventMetadata({ title: 'Cloud City Zero-Proof Party' });

        expect(metadata.title).toBe('Cloud City Zero-Proof Party');
        expect(metadata.description).toBe(EVENT_METADATA_FALLBACK_DESCRIPTION);
        expect(metadata.openGraph).toMatchObject({
            title: 'Cloud City Zero-Proof Party',
            description: EVENT_METADATA_FALLBACK_DESCRIPTION,
            type: 'website'
        });
        expect(metadata.twitter).toMatchObject({
            card: 'summary',
            title: 'Cloud City Zero-Proof Party',
            description: EVENT_METADATA_FALLBACK_DESCRIPTION
        });
    });

    it('does not promote an unsupported excerpt claim or require excerpt data', () => {
        const eventWithUnsupportedExcerpt = {
            title: 'Music Block',
            excerpt: '<p>This independently hosted event is no-alcohol.</p>'
        } as Partial<Post>;

        const metadataWithExcerpt = buildEventMetadata(eventWithUnsupportedExcerpt);
        const metadataWithoutExcerpt = buildEventMetadata({ title: 'Music Block' });

        expect(metadataWithExcerpt).toEqual(metadataWithoutExcerpt);
        expect(metadataWithExcerpt.description).toBe(EVENT_METADATA_FALLBACK_DESCRIPTION);
        expect(metadataWithExcerpt.openGraph?.description).not.toContain('no-alcohol');
        expect(metadataWithExcerpt.twitter?.description).not.toContain('no-alcohol');
    });

    it('retains an image only when it uses the approved HTTPS media origin', () => {
        const metadata = buildEventMetadata({
            title: 'Music Block',
            featuredImage: {
                node: {
                    sourceUrl: 'https://cirquitree.com/wp-content/uploads/music-block.jpg',
                    altText: 'Music Block artwork'
                }
            } as Post['featuredImage']
        });

        expect(metadata.openGraph).toMatchObject({
            images: [
                {
                    url: 'https://cirquitree.com/wp-content/uploads/music-block.jpg',
                    alt: 'Music Block artwork'
                }
            ]
        });
        expect(metadata.twitter).toMatchObject({
            images: ['https://cirquitree.com/wp-content/uploads/music-block.jpg']
        });
    });

    it.each([
        'http://cirquitree.com/wp-content/uploads/music-block.jpg',
        'https://evil.example/music-block.jpg',
        'https://cirquitree.com.evil.example/music-block.jpg',
        'https://user:password@cirquitree.com/wp-content/uploads/music-block.jpg',
        'not a URL'
    ])('omits a malformed or unapproved image URL: %s', sourceUrl => {
        const metadata = buildEventMetadata({
            title: 'Music Block',
            featuredImage: {
                node: {
                    sourceUrl,
                    altText: 'Music Block artwork'
                }
            } as Post['featuredImage']
        });

        expect(metadata.openGraph).not.toHaveProperty('images');
        expect(metadata.twitter).not.toHaveProperty('images');
        expect(metadata.twitter).toMatchObject({ card: 'summary' });
    });
});
