'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea,
  buttonVariants,
} from '@/components/ui';
import { MarkdownPreview } from '@/components/web/MarkdownPreview';
import { postSchema, updatePostSchema } from '@/app/schemas/blog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import z from 'zod';

type CreateValues = z.infer<typeof postSchema>;
type UpdateValues = z.infer<typeof updatePostSchema>;

type PostEditorProps =
  | {
      mode: 'create';
      onSubmit: (formData: FormData) => Promise<{ error?: string } | void>;
    }
  | {
      mode: 'edit';
      postId: string;
      defaultValues: {
        title: string;
        content: string;
      };
      onSubmit: (formData: FormData) => Promise<{ error?: string } | void>;
    };

export function PostEditor(props: PostEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isCreate = props.mode === 'create';

  const form = useForm({
    resolver: zodResolver(isCreate ? postSchema : updatePostSchema),
    defaultValues:
      isCreate ?
        {
          title: '',
          content: '',
          image: undefined,
        }
      : {
          postId: props.postId,
          title: props.defaultValues.title,
          content: props.defaultValues.content,
          image: undefined,
        },
  });

  const content = useWatch({ control: form.control, name: 'content' });

  function onSubmit(values: CreateValues | UpdateValues) {
    setSubmitError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);

      if (!isCreate) {
        formData.append('postId', (values as UpdateValues).postId);
        const image = (values as UpdateValues).image;
        if (image) {
          formData.append('image', image);
        }
      } else {
        formData.append('image', (values as CreateValues).image);
      }

      const result = await props.onSubmit(formData);

      if (result && 'error' in result && result.error) {
        setSubmitError(result.error);
      }
    });
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isCreate ? 'Create Blog Article' : 'Edit Blog Article'}
        </CardTitle>
        <CardDescription>
          {isCreate ?
            'Write in Markdown — use Preview to see how it will look.'
          : 'Update your post. Leave image empty to keep the current cover.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
            {!isCreate && <input type="hidden" {...form.register('postId')} />}

            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter post title ..."
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-2 border-b pb-2">
              <Button
                type="button"
                variant={tab === 'write' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTab('write')}>
                Write
              </Button>
              <Button
                type="button"
                variant={tab === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTab('preview')}>
                Preview
              </Button>
            </div>

            {tab === 'write' ?
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content (Markdown)</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="## Heading&#10;&#10;Write your post in **Markdown** ..."
                      className="min-h-48 font-mono text-sm"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            : <div className="min-h-48 rounded-md border border-border p-4">
                <MarkdownPreview markdown={content ?? ''} />
              </div>
            }

            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    {isCreate ? 'Cover image' : 'New cover image (optional)'}
                  </FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className={buttonVariants({
                variant: 'default',
                size: 'lg',
              })}>
              {isPending ?
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Saving...</span>
                </>
              : <span>{isCreate ? 'Create Post' : 'Save changes'}</span>}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
