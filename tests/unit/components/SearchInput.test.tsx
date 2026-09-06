import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useQuery } from 'convex/react';
import { SearchInput } from '@/components/web/SearchInput';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
}));

describe('SearchInput', () => {
  it('does not query convex until the term reaches 2 characters', async () => {
    vi.mocked(useQuery).mockReturnValue(undefined);
    const user = userEvent.setup();
    render(<SearchInput />);

    await user.type(screen.getByPlaceholderText('Search posts...'), 'a');

    expect(useQuery).toHaveBeenLastCalledWith(expect.anything(), 'skip');
    expect(screen.queryByText('No results found!')).not.toBeInTheDocument();
  });

  it('shows a loading state while the query is pending', async () => {
    vi.mocked(useQuery).mockReturnValue(undefined);
    const user = userEvent.setup();
    render(<SearchInput />);

    await user.type(screen.getByPlaceholderText('Search posts...'), 'ab');

    expect(useQuery).toHaveBeenLastCalledWith(expect.anything(), {
      limit: 5,
      term: 'ab',
    });
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('shows an empty state when there are no matches', async () => {
    vi.mocked(useQuery).mockReturnValue([]);
    const user = userEvent.setup();
    render(<SearchInput />);

    await user.type(screen.getByPlaceholderText('Search posts...'), 'xyz');

    expect(screen.getByText('No results found!')).toBeInTheDocument();
  });

  it('lists matching posts as links and clears the term on click', async () => {
    vi.mocked(useQuery).mockReturnValue([
      { _id: 'post_1', slug: 'my-post', title: 'My Post', body: 'Body text' },
    ]);
    const user = userEvent.setup();
    render(<SearchInput />);

    const input = screen.getByPlaceholderText('Search posts...');
    await user.type(input, 'my');

    const link = screen.getByRole('link', { name: /My Post/ });
    expect(link).toHaveAttribute('href', '/blog/my-post');

    await user.click(link);
    expect(input).toHaveValue('');
  });
});
