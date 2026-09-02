import { BlurFade } from '@/components/motion/blur-fade';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger';
import { BlogGrid } from '@/components/web/blog-grid';
import { CtaSection } from '@/components/web/cta-section';
import { SubscribeForm } from '@/components/web/subscribe-form';
import { posts } from '@/lib/blog-data';

export default async function Home() {

  return (
    <div className="flex mb-12 flex-col">
      {/* Hero Section */}

      <section className="mx-auto max-w-6xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
        <StaggerContainer
          staggerDelay={0.12}
          className="flex flex-col items-center gap-5">
          <StaggerItem>
            <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              Front-end development notes
            </span>
          </StaggerItem>

          {/*main heading*/}
          <StaggerItem yOffset={16}>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Ideas on lorem, and building
            </h1>
          </StaggerItem>

          <StaggerItem yOffset={16}>
            <p className="max-w-4xl text-lg text-muted-foreground">
              Essays and field notes from product craft, and the small decisions
              that make software feel considered.
            </p>
          </StaggerItem>

          <StaggerItem yOffset={16}>
            <SubscribeForm className="flex flex-col max-w-2xl items-center mt-10 mb-20 gap-2 sm:flex-row" />
          </StaggerItem>
        </StaggerContainer>
      </section>

      <BlurFade inView className="mx-auto w-full mb-10 max-w-6xl px-4 sm:px-6">
        <CtaSection />
      </BlurFade>

      <section className="mx-auto max-w-6xl px-4 pt-16 text-center sm:px-6 sm:pt-24">
        <StaggerContainer staggerDelay={0.06} className="mb-12">
          <StaggerItem yOffset={12}>
            <h2 className="text-5xl mb-3 font-semibold tracking-tight">
              All articles
            </h2>
          </StaggerItem>
          <StaggerItem yOffset={12}>
            <p className="mt-1 text-muted-foreground">
              Filter by topic or search to find what you&apos;re after.
            </p>
          </StaggerItem>
        </StaggerContainer>

        <BlurFade delay={0.14}>
          <BlogGrid posts={posts} />
        </BlurFade>
      </section>
    </div>
  );
}
