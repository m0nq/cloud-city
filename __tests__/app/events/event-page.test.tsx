import { render, screen } from '@testing-library/react';
import EventPage, { generateStaticParams } from '@/app/events/[event]/page';
import { getPost, getPosts } from '@/utils/api/wp-actions';
import { resolveHeroTone } from '@/utils/hero-tone';

jest.mock('@/utils/api/wp-actions', () => ({
    getPosts: jest.fn(),
    getPost: jest.fn()
}));

jest.mock('@/utils/hero-tone', () => ({
    resolveHeroTone: jest.fn()
}));

jest.mock('@/components/utils/back-button/back-button', () => ({
    BackButton: ({ children }: { children: React.ReactNode }) => <button>{children}</button>
}));

jest.mock('@/components/location/event-location', () => ({
    EventLocation: ({ address }: { address: string }) => <p>{address}</p>
}));

const mockGetPosts = getPosts as jest.Mock;
const mockGetPost = getPost as jest.Mock;
const mockResolveHeroTone = resolveHeroTone as jest.Mock;

describe('events/[event]/page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockResolveHeroTone.mockResolvedValue('dark');
    });

    it('generateStaticParams extracts event slug from post URI', async () => {
        mockGetPosts.mockResolvedValueOnce({
            posts: [
                { post: { uri: '/events/sunrise-session/' } },
                { post: { uri: 'events/twilight-session' } },
                { post: { uri: '/' } }
            ]
        });

        const params = await generateStaticParams();

        expect(mockGetPosts).toHaveBeenCalledWith({ tag: 'Cloud City', category: 'Events' }, 100);
        expect(params).toEqual([{ event: 'sunrise-session' }, { event: 'twilight-session' }, { event: '' }]);
    });

    it('generateStaticParams returns empty array when post lookup fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        mockGetPosts.mockRejectedValueOnce(new Error('wp-timeout'));

        try {
            const params = await generateStaticParams();
            expect(params).toEqual([]);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[events/[event]] Failed to generate static params:',
                expect.any(Error)
            );
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });

    it('renders not-found UI when getPost returns an empty object', async () => {
        mockGetPost.mockResolvedValueOnce({});

        const node = await EventPage({ params: Promise.resolve({ event: 'missing-event' }) });
        render(<>{node}</>);

        expect(mockGetPost).toHaveBeenCalledWith('missing-event');
        expect(screen.getByText('Event not found')).toBeInTheDocument();
    });

    it('renders event details, decorative hero media, CMS alt text, and featured images when optional fields are present', async () => {
        mockGetPost.mockResolvedValueOnce({
            title: 'Sunrise Session',
            content: '<p>Bring water and good vibes.</p>',
            eventsFields: {
                address: 'Pier 7',
                eventDateTime: '2026-05-10T19:00:00-07:00',
                ticketLink: 'https://tickets.example.com/sunrise'
            },
            featuredImage: {
                node: {
                    sourceUrl: 'https://cdn.example.com/sunrise.jpg',
                    altText: 'Colored lights over the dance floor',
                    mediaDetails: {
                        width: 1600,
                        height: 900
                    }
                }
            }
        });

        const node = await EventPage({ params: Promise.resolve({ event: 'sunrise-session' }) });
        render(<>{node}</>);
        const images = document.querySelectorAll('img');

        expect(screen.getByText('Sunrise Session')).toBeInTheDocument();
        expect(screen.getByText('Bring water and good vibes.')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Tickets/i })).toHaveAttribute(
            'href',
            'https://tickets.example.com/sunrise'
        );
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('alt', '');
        expect(images[1]).toHaveAttribute('alt', 'Colored lights over the dance floor');
        expect(screen.queryByAltText('Sunrise Session featured image')).not.toBeInTheDocument();
        expect(images[0]).toHaveAttribute('width', '1600');
        expect(images[0]).toHaveAttribute('height', '900');
        expect(images[1]).toHaveAttribute('width', '1600');
        expect(images[1]).toHaveAttribute('height', '900');
        expect(screen.getByRole('button', { name: '← Back' })).toBeInTheDocument();
    });

    it('preserves intentionally empty CMS alt text and falls back for unusable dimensions', async () => {
        mockGetPost.mockResolvedValueOnce({
            title: 'Empty Alt Event',
            content: '<p>Content</p>',
            eventsFields: {
                address: 'Venue',
                eventDateTime: '2026-05-10T19:00:00-07:00'
            },
            featuredImage: {
                node: {
                    sourceUrl: 'https://cdn.example.com/empty-alt.jpg',
                    altText: '',
                    mediaDetails: {
                        width: 0,
                        height: -1
                    }
                }
            }
        });

        const node = await EventPage({ params: Promise.resolve({ event: 'empty-alt-event' }) });
        render(<>{node}</>);
        const images = document.querySelectorAll('img');

        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('alt', '');
        expect(images[1]).toHaveAttribute('alt', '');
        expect(images[0]).toHaveAttribute('width', '1920');
        expect(images[0]).toHaveAttribute('height', '1080');
        expect(images[1]).toHaveAttribute('width', '1920');
        expect(images[1]).toHaveAttribute('height', '1080');
    });

    it.each([
        ['landscape', 1600, 900, 1600, 900],
        ['portrait', 270, 480, 270, 480],
        ['square', 1000, 1000, 1000, 1000],
        ['missing width', undefined, 900, 1920, 1080],
        ['missing height', 1600, undefined, 1920, 1080],
        ['zero width', 0, 900, 1920, 1080],
        ['zero height', 1600, 0, 1920, 1080],
        ['negative width', -1, 900, 1920, 1080],
        ['negative height', 1600, -1, 1920, 1080],
        ['non-finite dimensions', Number.NaN, Number.NaN, 1920, 1080],
        ['null media details', null, null, 1920, 1080],
        ['undefined media details', undefined, undefined, 1920, 1080]
    ])('uses a safe intrinsic dimension pair for %s media', async (_name, width, height, expectedWidth, expectedHeight) => {
        mockGetPost.mockResolvedValueOnce({
            title: 'Dimension Event',
            content: '<p>Content</p>',
            eventsFields: {
                address: 'Venue',
                eventDateTime: '2026-05-10T19:00:00-07:00'
            },
            featuredImage: {
                node: {
                    sourceUrl: 'https://cdn.example.com/dimension-test.jpg',
                    altText: 'Dimension test image',
                    mediaDetails: width === null || (width === undefined && height === undefined) ? width : { width, height }
                }
            }
        });

        const node = await EventPage({ params: Promise.resolve({ event: 'dimension-event' }) });
        render(<>{node}</>);
        const images = document.querySelectorAll('img');

        expect(images[0]).toHaveAttribute('width', String(expectedWidth));
        expect(images[0]).toHaveAttribute('height', String(expectedHeight));
        expect(images[1]).toHaveAttribute('width', String(expectedWidth));
        expect(images[1]).toHaveAttribute('height', String(expectedHeight));
    });

    it('renders the detected hero tone for the logistics foreground', async () => {
        mockResolveHeroTone.mockResolvedValueOnce('light');
        mockGetPost.mockResolvedValueOnce({
            title: 'Light Hero Event',
            content: '<p>Content</p>',
            eventsFields: {
                address: 'Venue',
                eventDateTime: '2026-05-10T19:00:00-07:00',
                heroBackgroundTone: ['light']
            },
            featuredImage: {
                node: {
                    sourceUrl: 'https://cdn.example.com/light-hero.jpg',
                    altText: null
                }
            }
        });

        const node = await EventPage({ params: Promise.resolve({ event: 'light-hero-event' }) });
        const { container } = render(<>{node}</>);

        expect(container.querySelector('[data-hero-tone="light"]')).toBeInTheDocument();
        expect(mockResolveHeroTone).toHaveBeenCalledWith(['light'], 'https://cdn.example.com/light-hero.jpg');
    });

    it('renders without ticket link and images when optional fields are absent', async () => {
        mockGetPost.mockResolvedValueOnce({
            title: 'Minimal Event',
            content: '<p>Core details only.</p>',
            eventsFields: {
                address: 'Secret Warehouse',
                eventDateTime: '2026-06-01T20:00:00-07:00',
                ticketLink: ''
            }
        });

        const node = await EventPage({ params: Promise.resolve({ event: 'minimal-event' }) });
        render(<>{node}</>);

        expect(screen.getByText('Minimal Event')).toBeInTheDocument();
        expect(screen.getByText('Core details only.')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Tickets/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('falls back to TBA address and empty content when optional fields are missing', async () => {
        mockGetPost.mockResolvedValueOnce({
            title: 'Fallback Event',
            eventsFields: {
                eventDateTime: '2026-06-01T20:00:00-07:00'
            },
            featuredImage: {
                node: {
                    sourceUrl: 'https://cdn.example.com/fallback.jpg',
                    altText: 'Provided alt text'
                }
            }
        });

        const node = await EventPage({ params: Promise.resolve({ event: 'fallback-event' }) });
        render(<>{node}</>);

        expect(screen.getByText('Fallback Event')).toBeInTheDocument();
        expect(screen.getByText('TBA')).toBeInTheDocument();
        expect(screen.getByAltText('Provided alt text')).toBeInTheDocument();
    });
});
