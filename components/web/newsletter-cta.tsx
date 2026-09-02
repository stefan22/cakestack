'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlurFade } from '@/components/motion/blur-fade';

export function NewsletterCta() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <BlurFade
      inView
      className="rounded-2xl border border-border bg-secondary/40 px-6 py-12 text-center sm:px-12">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Ideas on motion, design, and building calm software.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
        {/*One email whenever we publish something worth reading. No spam,*/}
        {/*unsubscribe any time. */}
        Lorem ipsum dolor sit amet, consectetur adipiscingelit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>

      <form
        className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}>
        <Input
          type="email"
          required
          placeholder="you@email.com"
          className="bg-background"
        />
        <Button type="submit" variant="default" className="shrink-0">
          <motion.span
            key={submitted ? 'done' : 'subscribe'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5">
            {submitted ?
              <>
                <Check className="size-4" /> Subscribed
              </>
            : 'Subscribe'}
          </motion.span>
        </Button>
      </form>
    </BlurFade>
  );
}
