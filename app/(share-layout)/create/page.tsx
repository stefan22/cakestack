import { PostEditor } from '@/components/web/PostEditor';
import { createBlogAction } from '@/app/actions';
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger';
import { BlurFade } from '@/components/motion/blur-fade';

export default function CreateRoute() {
  return (
    <div className="py-12">
      <StaggerContainer staggerDelay={0.1} className="text-center mb-12">
        <StaggerItem yOffset={14}>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Create Post
          </h1>
        </StaggerItem>
        <StaggerItem yOffset={14}>
          <p className="text-xl text-muted-foreground pt-4">
            Sharing is Caring. Let&apos;s write a new post!
          </p>
        </StaggerItem>
      </StaggerContainer>

      <BlurFade delay={0.18}>
        <PostEditor mode="create" onSubmit={createBlogAction} />
      </BlurFade>
    </div>
  );
}
