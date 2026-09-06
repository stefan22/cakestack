import { describe, it, expect, beforeEach } from 'vitest';
import { vi } from 'vitest';
import { useConvexAuth } from 'convex/react';
import Navbar from '../../components/web/Navbar';
import { render, screen } from '@testing-library/react';

// mock convex lib - top level req
vi.mock('convex/react', () => ({
  useConvexAuth: vi.fn(),
  useQuery: vi.fn(() => undefined),
}));

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>();
  const { useRouter } =
    await vi.importActual<typeof import('next-router-mock')>(
      'next-router-mock'
    );

  const usePathname = vi.fn().mockImplementation(() => {
    const router = useRouter();
    return router.pathname;
  });

  const useSearchParams = vi.fn().mockImplementation(() => {
    const router = useRouter();
    return new URLSearchParams(router.query?.toString());
  });

  return {
    ...actual,
    useRouter: vi.fn().mockImplementation(useRouter),
    usePathname,
    useSearchParams,
  };
});

describe('Navbar Component', () => {
  // nav component: user not authenticated
  describe('User not Authenticated', () => {
    beforeEach(() => {
      vi.mocked(useConvexAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRefreshing: false,
      });
    });

    it('displays the navbar <home/> link correctly', () => {
      //set auth to false
      vi.mocked(useConvexAuth).mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isRefreshing: false,
      });
      //navbar compo
      render(<Navbar />);
      //home page navbar tab - shared route
      const hometab = screen.getByTestId(`nav-link-home`);
      expect(hometab).toBeInTheDocument();
      expect(hometab).toHaveAttribute('href', '/');
    });
  }); // user not authenticated

  // it('displays the navbar <Sign Up/> button correctly', () => {
  //   render(<Navbar />);
  //   const navHome = screen.getAllByTestId(`nav-link-signup`);
  //   expect(navHome).toBeInTheDocument();
  //   expect(navHome).toHaveAttribute('href', '/');
  // });
  //
  // it('displays the navbar <Sign In/> button link correctly', () => {
  //   render(<Navbar />);
  //   const navHome = screen.getAllByTestId(`nav-link-signin`);
  //   expect(navHome).toBeInTheDocument();
  //   expect(navHome).toHaveAttribute('href', '/');
  // });
  //
  // it('displays the correct number of <Navbar/> links to unauthenticated users', () => {
  //   render(<Navbar />); // atm all these links are shared links
  //   const navlinks = 5; //Home, Blog, Create, Sign Up, Sign In
  //   const allNavLinks = screen.getAllByTestId(/^nav-link-/);
  //   expect(allNavLinks).toHaveLength(navlinks);
  // });
  // }); // not authenticated
});
