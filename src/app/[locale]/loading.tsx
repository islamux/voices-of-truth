export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <div className="animate-pulse">
        <div className="mb-2 h-3.5 w-28 rounded bg-muted" />
        <div className="mb-3 h-9 w-72 rounded-lg bg-muted" />
        <div className="mb-10 h-4 w-56 rounded bg-muted" />

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end">
          <div className="h-10 flex-1 rounded-md bg-muted" />
          <div className="h-10 w-40 rounded-md bg-muted" />
          <div className="h-10 w-40 rounded-md bg-muted" />
          <div className="h-10 w-40 rounded-md bg-muted" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-6"
            >
              <div className="h-28 w-28 rounded-full bg-muted" />
              <div className="mt-5 h-5 w-32 rounded bg-muted" />
              <div className="mt-2 h-4 w-24 rounded bg-muted" />
              <div className="mt-5 h-px w-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
