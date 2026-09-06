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
        placeholder="You@email.com"
        className="flex w-full p-4"
      />
      <Button
        className="flex w-full sm:w-27 p-4"
        type="submit"
        variant="default">
        Subscribe
      </Button>
    </form>
  );
}
