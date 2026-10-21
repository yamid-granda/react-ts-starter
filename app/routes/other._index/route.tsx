import { Link } from 'react-router'

export default function Other() {
  return (
    <section className="space-y-6">
      <title>Other — React + TypeScript Starter</title>
      <meta
        name="description"
        content="A dummy page demonstrating React Router file-based routing."
      />

      <p className="font-mono text-indigo-600 text-xs uppercase tracking-[0.18em]">Dummy route</p>
      <h1 className="text-balance font-semibold text-4xl text-slate-900 tracking-tight sm:text-5xl">
        This is the other page.
      </h1>
      <p className="max-w-xl text-base text-slate-600 leading-7">
        It lives at{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800 text-sm">
          app/routes/other._index.tsx
        </code>{' '}
        and is served at{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800 text-sm">
          /other
        </code>
        . Add or rename files in{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800 text-sm">
          app/routes
        </code>{' '}
        to create routes.
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-md font-medium text-indigo-600 text-sm transition-colors hover:text-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
      >
        ← Back home
      </Link>
    </section>
  )
}
