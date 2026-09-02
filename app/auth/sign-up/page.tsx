'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  buttonVariants,
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
  Input,
} from '@/components/ui';

import { BlurFade } from '@/components/motion/blur-fade';
import Image from 'next/image';
import { signUpSchema } from '@/app/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import z from 'zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSignup = async (data: z.infer<typeof signUpSchema>) => {
    startTransition(async () => {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
        },
        {
          onSuccess: () => {
            toast.success('Signed up successfully!');
            form.reset({
              email: '',
              name: '',
              password: '',
            });
            router.push('/');
          },
          onError: (err) => {
            toast.error(err.error.message);
          },
        }
      );
    });
  }; //onSignup

  return (
    <div className="py-8">
      <div className="relative flex overflow-hidden mx-auto lg:max-w-4xl">
        <BlurFade
          inView
          className="flex animate-in fade-in slide-in-from-bottom-6 duration-500">
          <Image
            src={
              'https://res.cloudinary.com/dak4fznwo/image/upload/v1767242722/next-blog/idcskllvhntoqtuqsot2.png'
            }
            width={1920}
            height={620}
            sizes={'lg'}
            alt="Sign Up page"
            loading="eager"
            className="hidden md:block object-cover max-w-md rounded-tl-lg rounded-bl-lg"
          />
        </BlurFade>

        <div className="w-full p-0 md:px-4 md:py-2 lg:w-1/2">
          <BlurFade inView className="mb-5">
            <h1 className="text-4xl px-4 pt-4 font-semibold text-gray-700 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              Because your 3am <br />
              <p className="text-xl text-gray-500 text-center mt-2 mb-0 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                Ideas Deserve Better!
              </p>
            </h1>
          </BlurFade>

          <div className="flex mb-0" />

          <div className="flex flex-col justify-center w-full">
            <Card className="ring-0 rounded-lg md:shadow-lg mb-4 md:mb-0 md:px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <BlurFade inView className="mb-6">
                  <CardTitle className="text-3xl md:text-2xl text-center">
                    Sign Up
                  </CardTitle>
                  <CardDescription className="hidden pt-2 md:block md:text-center md:text-sm">
                    Create an account to get started
                  </CardDescription>
                </BlurFade>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSignup)}>
                  <FieldGroup className={'gap-4'}>
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="name">Fullname</FieldLabel>
                          <Input
                            id="name"
                            className={cn(
                              buttonVariants({
                                size: 'lg',
                                variant: 'outline',
                              }),
                              '!text-[16px] md:!text-sm'
                            )}
                            aria-invalid={fieldState.invalid}
                            type="text"
                            placeholder="Enter name"
                            autoComplete="name"
                            required
                            {...field}
                            //come back not extremely important since it fixed the problem
                            //but it is redundant, fields is within controller.
                            name="name"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="email">Email</FieldLabel>
                          <Input
                            id="email"
                            className={cn(
                              buttonVariants({
                                size: 'lg',
                                variant: 'outline',
                              }),
                              '!text-[16px] md:!text-sm'
                            )}
                            aria-invalid={fieldState.invalid}
                            type="email"
                            placeholder="Enter email"
                            autoComplete="email"
                            required
                            {...field}
                            name="email"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="password"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                          <Input
                            id="password"
                            className={cn(
                              buttonVariants({
                                size: 'lg',
                                variant: 'outline',
                              }),
                              '!text-[16px] md:!text-sm'
                            )}
                            aria-invalid={fieldState.invalid}
                            type="password"
                            autoComplete="new-password"
                            placeholder="Enter password"
                            required
                            {...field}
                            name="password"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <div className="gap-4" />
                    <Button
                      disabled={isPending}
                      type="submit"
                      className={cn(
                        buttonVariants({
                          variant: 'default',
                          size: 'lg',
                        })
                      )}>
                      {isPending ?
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      : <span>Sign Up</span>}
                    </Button>
                  </FieldGroup>
                </form>
                <p className="flex justify-center w-full text-muted-foreground text-xs pt-3">
                  Already have an account? &nbsp;{' '}
                  <Link className="text-blue-900" href="/auth/sign-in">
                    Click here
                  </Link>
                  &nbsp; to sign in.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
