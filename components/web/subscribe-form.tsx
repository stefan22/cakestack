'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SubscribeForm({ className }: { className?: string }) {
  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
      }}>
      <Input
        type="email"
        required
        placeholder="Your email"
        className="sm:w-64"
      />
      <Button type="submit" variant="default">
        Subscribe
      </Button>
    </form>
  );
}
