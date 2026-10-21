import { QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { cn } from '@/lib/cn'
import { createQueryClient } from '@/lib/query-client'
import './app.css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function HydrateFallback() {
  return <div className="grid min-h-dvh place-items-center text-slate-500 text-sm">Loading…</div>
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-md px-3 py-1.5 font-medium text-sm transition-colors',
    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  )
}

export default function App() {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6">
        <header className="border-slate-200 border-b">
          <nav aria-label="Primary" className="flex items-center gap-1 py-4">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/other" className={navLinkClass}>
              Other
            </NavLink>
            <NavLink to="/tasks" className={navLinkClass}>
              Tasks
            </NavLink>
          </nav>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-12 py-12">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  )
}
