import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <h2 className="text-4xl font-bold text-foreground mb-4">404</h2>
      <p className="text-xl text-muted-foreground mb-6">
        Page not found
      </p>
      <Link
        href="/en"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
      >
        Go home
      </Link>
    </div>
  );
}
