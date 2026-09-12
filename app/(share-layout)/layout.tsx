import { ReactNode } from 'react';
import Navbar from '@/components/web/navbar';
import { Footer } from '@/components/web/footer';

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
