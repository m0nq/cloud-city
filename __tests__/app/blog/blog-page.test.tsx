import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@/utils/api/wp-actions', () => ({
  getPosts: jest.fn()
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={typeof href === 'string' ? href : String(href)} {...props}>
      {children}
    </a>
  )
}));

import BlogPage from '@/app/blog/page';
import { getPosts } from '@/utils/api/wp-actions';

const mockGetPosts = getPosts as jest.Mock;

describe('blog/page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty fallback when no posts are returned', async () => {
    mockGetPosts.mockResolvedValueOnce({
      posts: [],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: null,
        endCursor: null
      }
    });

    const node = await BlogPage();
    render(<>{node}</>);

    expect(mockGetPosts).toHaveBeenCalledWith({ tag: 'Cloud City', category: 'Blog' }, 100);
    expect(screen.getByText('Soon...')).toBeInTheDocument();
  });

  it('renders a distinct error state when the CMS request fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetPosts.mockRejectedValueOnce(new Error('ETIMEDOUT'));

    const node = await BlogPage();
    render(<>{node}</>);

    expect(mockGetPosts).toHaveBeenCalledWith({ tag: 'Cloud City', category: 'Blog' }, 100);
    expect(screen.getByText('Articles are temporarily unavailable.')).toBeInTheDocument();
    expect(screen.getByText('ETIMEDOUT')).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith('[blog] Failed to fetch posts during prerender:', expect.any(Error));
  });

  it('normalizes article links for URIs with and without leading slash', async () => {
    mockGetPosts.mockResolvedValueOnce({
      posts: [
        {
          post: {
            databaseId: 1,
            uri: '/with-leading/',
            title: 'With Leading',
            date: '2026-01-10T00:00:00Z',
            excerpt: '<p>one</p>'
          }
        },
        {
          post: {
            databaseId: 2,
            uri: 'without-leading/',
            title: 'Without Leading',
            date: '2026-01-11T00:00:00Z',
            excerpt: '<p>two</p>'
          }
        }
      ],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: null,
        endCursor: null
      }
    });

    const node = await BlogPage();
    render(<>{node}</>);

    const links = screen.getAllByRole('link');
    expect(links.some(link => link.getAttribute('href') === '/blog/with-leading/')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '/blog/without-leading/')).toBe(true);
  });

  it('renders pagination buttons from pageInfo and calls getPosts with cursor values', async () => {
    const user = userEvent.setup();

    mockGetPosts.mockResolvedValue({
      posts: [
        {
          post: {
            databaseId: 1,
            uri: '/sample/',
            title: 'Sample',
            date: '2026-01-10T00:00:00Z',
            excerpt: '<p>sample</p>'
          }
        }
      ],
      pageInfo: {
        hasPreviousPage: true,
        hasNextPage: true,
        startCursor: 'cursor-start',
        endCursor: 'cursor-end'
      }
    });

    const node = await BlogPage();
    render(<>{node}</>);

    const newerButton = screen.getByRole('button', { name: /Newer Posts/i });
    const olderButton = screen.getByRole('button', { name: /Older Posts/i });

    await user.click(newerButton);
    await user.click(olderButton);

    expect(mockGetPosts).toHaveBeenCalledWith({ tag: 'Cloud City', category: 'Blog' }, 10, { before: 'cursor-start' });
    expect(mockGetPosts).toHaveBeenCalledWith({ tag: 'Cloud City', category: 'Blog' }, 10, { after: 'cursor-start' });
  });
});
