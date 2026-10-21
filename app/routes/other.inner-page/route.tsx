import { Link } from 'react-router'

export default function OtherInnerPage() {
  return (
    <section className="space-y-6">
      <title>Inner page — React + TypeScript Starter</title>
      <meta name="description" content="A nested sample route inside the other page." />

      <p className="font-mono text-indigo-600 text-xs uppercase tracking-[0.18em]">Nested route</p>
      <h1 className="text-balance font-semibold text-4xl text-slate-900 tracking-tight sm:text-5xl">
        This is the inner page.
      </h1>
      <p className="max-w-xl text-base text-slate-600 leading-7">
        It lives at{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800 text-sm">
          app/routes/other.inner-page.tsx
        </code>{' '}
        and is served at{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800 text-sm">
          /other/inner-page
        </code>
        . It renders inside the{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800 text-sm">
          &lt;Outlet /&gt;
        </code>{' '}
        of{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-800 text-sm">
          app/routes/other.tsx
        </code>
        .
      </p>
      <Link
        to="/other"
        className="inline-flex items-center rounded-md font-medium text-indigo-600 text-sm transition-colors hover:text-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
      >
        ← Back to other
      </Link>
    </section>
  )
}
