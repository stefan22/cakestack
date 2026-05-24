'use client';

import { signInSchema } from '@/app/schemas/auth';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  buttonVariants,
} from '@/components/ui';

import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import GoogleLogo from '@/components/web/GoogleLogo';

export default function SignInPage() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onSignin = async (data: z.infer<typeof signInSchema>) => {
    startTransition(async () => {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success('Signed in Successfully');
            form.reset({
              email: '',
              password: '',
            });
            router.push('/');
          },
          onError: (err) => {
            toast.error(err.error.message);
          },
        },
      });
    });
  };

  return (
    <div className="py-8">
      <div className="relative flex overflow-hidden mx-auto lg:max-w-4xl">
        <Image
          src={
            'https://res.cloudinary.com/dak4fznwo/image/upload/v1767237743/blog-mern/banners/man-on-a-street.jpg'
          }
          width={1920}
          height={620}
          sizes={'lg'}
          alt="Sign In page"
          loading="eager"
          className="hidden md:block object-cover max-w-md rounded-tl-lg rounded-bl-lg"
        />

        <div className="w-full p-0 md:p-4 lg:w-1/2">
          <h1 className="text-4xl font-semibold text-gray-700 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            Welcome back!
          </h1>
          <p className="text-sm text-gray-500 text-center mt-2 mb-0 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            It hasn&apos;t been the same without you.
          </p>
          <div className="flex mt-4 md:hidden" />

          <div className="flex flex-col-reverse md:flex-col justify-center w-full">
            <div className="flex w-full items-center justify-center">
              <Button
                type="button"
                onClick={() =>
                  authClient.signIn.social({
                    provider: 'google',
                    callbackURL: '/',
                  })
                }
                className="flex px-4 py-5 items-center justify-center mt-6 md:mt-0 mb-4 rounded-lg shadow-none md:shadow-md hover:bg-gray-100 bg-transparent border border-gray-200">
                <div className="px-0 py-3">
                  <GoogleLogo />
                </div>

                <h2 className="text-center text-base text-gray-600 font-semibold">
                  Sign in with Google
                </h2>
              </Button>
            </div>

            <div className="my-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <Link
                href="#"
                className="text-xs text-center text-gray-500 uppercase">
                or login with email
              </Link>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>

            <Card className="ring-0 rounded-lg md:shadow-lg mb-4 md:mb-0 md:px-4 mt-3 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader>
                <CardTitle className="text-3xl md:text-2xl text-center">
                  Sign In
                </CardTitle>
                <CardDescription className="hidden md:block md:text-center md:text-sm">
                  Signin with your email and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSignin)}>
                  <FieldGroup className={'gap-4'}>
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
                            autoComplete="current-password"
                            placeholder="Enter password"
                            required
                            {...field}
                            //Field has name,value, onChange
                            //controller makes it redundant but it was here for reason - comeback
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
                      type="submit"
                      disabled={isPending}
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
                      : <span>Sign In</span>}
                    </Button>
                  </FieldGroup>
                </form>
                <p className="flex justify-center w-full text-muted-foreground text-xs pt-3">
                  Don&apos;t have an account? &nbsp;{' '}
                  <Link className="text-blue-900" href="/auth/sign-up">
                    Click here
                  </Link>
                  &nbsp; to sign up.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
