import { useState } from 'react'
import { Button } from '@/components/Button/Button'

const testingLayers = [
  {
    id: '01',
    title: 'Vitest + RTL',
    description: 'Fast behavior tests in jsdom.',
  },
  {
    id: '02',
    title: 'Storybook',
    description: 'Component states, docs and manual review.',
  },
  {
    id: '03',
    title: 'Playwright',
    description: 'Real Chromium component tests.',
  },
] as const

export function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-12 px-6 py-16">
      <header className="space-y-4">
        <p className="font-mono text-indigo-600 text-xs uppercase tracking-[0.18em]">
          React + TypeScript
        </p>
        <h1 className="text-balance font-semibold text-4xl text-slate-900 tracking-tight sm:text-5xl">
          A starter with the boring parts already done.
        </h1>
        <p className="max-w-xl text-base text-slate-600 leading-7">
          Vite, Tailwind CSS, Biome, Storybook, Vitest and Playwright are wired together. Replace
          this page and keep the guardrails.
        </p>
      </header>

      <section
        aria-labelledby="demo-heading"
        className="rounded-card border border-slate-200 bg-white p-6 shadow-card"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="demo-heading" className="font-semibold text-slate-900 text-sm">
              Interactive demo
            </h2>
            <p className="mt-1 text-slate-500 text-sm">
              State, user-event and Playwright stories all point at this component.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setCount((value) => value + 1)}>Count: {count}</Button>
            <Button variant="secondary" onClick={() => setCount(0)}>
              Reset
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="layers-heading" className="space-y-3">
        <h2 id="layers-heading" className="font-semibold text-slate-900 text-sm">
          Three testing layers
        </h2>
        <ul className="grid gap-3 text-slate-600 text-sm sm:grid-cols-3">
          {testingLayers.map((layer) => (
            <li
              key={layer.id}
              className="rounded-lg border border-slate-200 bg-white p-4 leading-6"
            >
              <span className="block font-mono text-slate-400 text-xs">{layer.id}</span>
              <span className="mt-2 block font-medium text-slate-900">{layer.title}</span>
              {layer.description}
            </li>
          ))}
        </ul>
      </section>

      <footer className="font-mono text-slate-500 text-xs">
        <p>pnpm storybook · pnpm test:ct · pnpm validate</p>
      </footer>
    </main>
  )
}
