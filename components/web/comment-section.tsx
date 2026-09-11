'use client';

import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Loader2, MessageSquare } from 'lucide-react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  useConvexAuth,
  useMutation,
  Preloaded,
  usePreloadedQuery,
} from 'convex/react';

import { commentSchema } from '@/app/schemas/comment';

import {
  Card,
  CardContent,
  CardHeader,
  Field,
  FieldError,
  FieldLabel,
  Separator,
  Textarea,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from '../ui';

export function CommentSection(props: {
  postId: Id<'posts'>;
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) {
  const { postId } = props;
  const data = usePreloadedQuery(props.preloadedComments);
  const { isAuthenticated, isLoading } = useConvexAuth();

  const [isPending, startTransition] = useTransition();

  const createComment = useMutation(api.comments.createComment);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: '',
      postId,
    },
  });

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    startTransition(async () => {
      try {
        await createComment(values);
        form.reset({ body: '', postId });
        toast.success('Comment posted');
      } catch {
        toast.error('Failed to create comment');
      }
    });
  }

  // convex data
  if (data === undefined)
    return (
      <div className="p-4 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  const commentCount = data.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">
          {commentCount === 0 ?
            'No Comments'
          : `${commentCount} Comment${commentCount > 1 ? 's' : ''}`}
        </h2>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Form Section */}
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Your Comment</FieldLabel>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Add your comments here..."
                  disabled={!isAuthenticated || isPending}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Only show the warning if NOT authenticated and NOT currently loading auth state */}
          {!isAuthenticated && !isLoading && (
            <p className="text-sm text-muted-foreground">
              You must be signed in to comment
            </p>
          )}

          <Button disabled={!isAuthenticated || isPending}>
            {isPending ?
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Posting...</span>
              </>
            : 'Comment'}
          </Button>
        </form>

        {data.length > 0 && (
          <>
            <Separator />
            <section className="space-y-6">
              {data.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <Avatar size="lg">
                    <AvatarImage
                      className="grayscale"
                      src="https://github.com/shadcn.png"
                      alt={comment.authorName}
                    />
                    <AvatarFallback>
                      {comment.authorName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                    <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                  </Avatar>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">
                        {comment.authorName}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(comment._creationTime).toLocaleDateString(
                          'en-GB'
                        )}
                      </p>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </CardContent>
    </Card>
  );
}
