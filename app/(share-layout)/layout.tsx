import { ReactNode } from 'react';
import Navbar from '@/components/web/navbar';

export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
