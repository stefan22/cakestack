import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useTheme } from 'next-themes';
import { ThemeToggle } from '@/components/web/ThemeToggle';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  it('sets the theme to dark when "Dark" is chosen', async () => {
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      setTheme,
      theme: 'light',
      themes: ['light', 'dark', 'system'],
    });

    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));
    await user.click(await screen.findByText('Dark'));

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('sets the theme to system when "System" is chosen', async () => {
    const setTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      setTheme,
      theme: 'dark',
      themes: ['light', 'dark', 'system'],
    });

    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));
    await user.click(await screen.findByText('System'));

    expect(setTheme).toHaveBeenCalledWith('system');
  });
});
