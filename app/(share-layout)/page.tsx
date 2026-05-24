import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button, buttonVariants } from '@/components/ui/button';

import { BookOpen, HomeIcon, PenTool } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  return (
    <div className="flex mb-12 flex-col ">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-16 px-0 sm:px-4 text-center ">
        <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
            CakeStack
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed"></p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8">
              <Link href="/create">Write a Post</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-0 px-0 sm:py-6 sm:px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
          <Card className="flex flex-col border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <HomeIcon className="w-6 h-6" />
              </div>
              <CardTitle>
                <h1 className="text-2xl text-pretty hover:text-gray-700 cursor-pointer">
                  Home
                </h1>
              </CardTitle>
              <CardDescription>Return to the landing page</CardDescription>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={
                    'https://res.cloudinary.com/dak4fznwo/image/upload/v1767242402/next-blog/uh7oe6qxtuileqw8rnbm.png'
                  }
                  fill
                  alt="leaves"
                  sizes="lg"
                  loading="eager"
                  className="rounded-sm object-cover"
                />
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Praesent tempus volutpat. <br />
                <br />
                Etiam nunc ut accumsan. Curabitur iaculis erat faucibus enim
                suscipit egestas. Suspendisse tortor consectetur elementum.
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href="/"
                className={buttonVariants({
                  className: 'w-full',
                  variant: 'default',
                  size: 'lg',
                })}>
                Go Home
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <CardTitle>
                <h1 className="text-2xl text-pretty hover:text-gray-700 cursor-pointer">
                  Blog
                </h1>
              </CardTitle>

              <CardDescription>Read our latest articles</CardDescription>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={
                    'https://res.cloudinary.com/dak4fznwo/image/upload/v1767242848/next-blog/ctmsyvj9lgs1thorv1eh.png'
                  }
                  fill
                  alt="leaves"
                  sizes="lg"
                  loading="eager"
                  className="rounded-sm object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Proin semper turpis et tempor interdum. Nunc dolor nisi,
                imperdiet ac fringilla sit amet, ullamcorper in felis.
                <br />
                Praesent elementum nulla sed imperdiet rhoncus. Orci varius
                natoque penatibus et magnis dis parturient montes, nascetur
                ridiculus mus.
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href="/blog"
                className={buttonVariants({
                  variant: 'default',
                  className: 'w-full',
                  size: 'lg',
                })}>
                Visit Blog
              </Link>
            </CardFooter>
          </Card>

          <Card className="flex flex-col border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <PenTool className="w-6 h-6" />
              </div>
              <CardTitle>
                <h1 className="text-2xl text-pretty hover:text-gray-700 cursor-pointer">
                  Create Post
                </h1>
              </CardTitle>
              <CardDescription>Share your thoughts</CardDescription>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={
                    'https://res.cloudinary.com/dak4fznwo/image/upload/v1767242782/next-blog/gmmmwgaa2gjffjfatfhj.png'
                  }
                  fill
                  alt="leaves"
                  sizes="lg"
                  loading="eager"
                  className="rounded-sm object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                Have something to say? <br />
                Create a new blog post and share it with the community. Etiam
                facilisis lacinia nunc ut accumsan. Curabitur iaculis erat
                faucibus enim suscipit egestas. Etiam facilisis lacinia nunc ut
                accumsan.
              </p>
            </CardContent>
            <CardFooter>
              <Link
                href="/create"
                className={buttonVariants({
                  className: 'w-full',
                  variant: 'default',
                  size: 'lg',
                })}>
                Create Post
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
