# React + TypeScript Starter

A small, opinionated frontend scaffold with the tooling already wired together:

- **React 19** + **TypeScript 7** + **Vite 8**
- **Tailwind CSS 4** via `@tailwindcss/vite` (CSS-first configuration)
- **Biome 2** for formatting, linting and import sorting
- **Storybook 10** for component documentation
- **Vitest 5** + **Testing Library** + **jsdom** for fast behavior tests
- **Playwright 1.64** for real-browser component tests
- **commitlint** + **Husky** + **lint-staged** for conventional commits

## Requirements

- Node.js 24+
- pnpm 12+

## Quick start

```sh
pnpm install
pnpm browsers   # downloads Chromium for Playwright
pnpm dev
```

The app runs at <http://localhost:5173>. The Playwright component gallery lives at
<http://localhost:5173/playwright/gallery/index.html>.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview the production build |
| `pnpm typecheck` | Run the TypeScript project build (`tsc -b`) |
| `pnpm lint` | Check formatting and lint rules with Biome |
| `pnpm lint:fix` | Apply Biome's safe fixes |
| `pnpm format` | Format all supported files |
| `pnpm test` | Run Vitest in watch mode |
| `pnpm test:run` | Run Vitest once |
| `pnpm test:coverage` | Run Vitest with V8 coverage |
| `pnpm storybook` | Start Storybook on port 6006 |
| `pnpm build-storybook` | Build the static Storybook |
| `pnpm test:ct` | Run Playwright component tests |
| `pnpm test:ct:ui` | Run Playwright component tests in UI mode |
| `pnpm test:ct:report` | Open the last Playwright HTML report |
| `pnpm browsers` | Install the Chromium browser |
| `pnpm validate` | Biome + TypeScript + unit tests |

## Project structure

```
.
├── .husky/                     # pre-commit and commit-msg hooks
├── .storybook/                 # Storybook configuration
├── playwright/gallery/         # Playwright component gallery
├── src/
│   ├── components/Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx     # Vitest + RTL
│   │   ├── Button.stories.tsx  # Storybook
│   │   └── Button.story.tsx    # Playwright gallery story
│   ├── lib/cn.ts               # clsx + tailwind-merge
│   ├── test/setup.ts           # jest-dom matchers + RTL cleanup
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── index.css
│   └── main.tsx
├── tests/components/           # Playwright specs
└── playwright.config.ts
```

The `@/` alias points at `src/` in TypeScript, Vite, Vitest and Playwright.

## Testing strategy

There are three deliberately separate layers:

| Layer | Tool | Files | Environment |
| --- | --- | --- | --- |
| Behavior | Vitest + RTL + user-event | `src/**/*.test.tsx` | jsdom |
| Documentation | Storybook | `src/**/*.stories.tsx` | browser |
| Real browser | Playwright `mount()` | `tests/components/*.spec.ts` | Chromium |

### Unit and behavior tests

Use Testing Library queries and `user-event`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { Button } from './Button'

it('calls onClick', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()

  render(<Button onClick={onClick}>Save</Button>)
  await user.click(screen.getByRole('button', { name: 'Save' }))

  expect(onClick).toHaveBeenCalledOnce()
})
```

`@testing-library/jest-dom` matchers are registered globally in `src/test/setup.ts`.

### Storybook

Stories use the standard CSF format from `@storybook/react-vite`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
```

The a11y addon is installed but set to `todo`, so accessibility findings appear in the
Storybook UI without failing builds. Change `parameters.a11y.test` in `.storybook/preview.ts`
to `error` when you are ready to enforce it.

### Playwright component tests

Playwright's component testing is a stable, framework-agnostic `mount()` fixture. There is no
`@playwright/experimental-ct-*` package (those were removed). Instead, this project owns a tiny
gallery page that Vite serves:

- `src/**/*.story.tsx` exports one React component per scenario.
- `playwright/gallery/main.tsx` discovers those exports and exposes `window.mount()`.
- `tests/components/*.spec.ts` calls `mount('Button/Primary')` and asserts against the page.

Story IDs are derived from the file path and export name. `src/components/Button/Button.story.tsx`
becomes `components/Button/<Export>`, and unique suffixes such as `Button/Primary` also work.

Use the story itself to record state that would otherwise be a callback crossing the
Node/browser boundary:

```tsx
export const CountsClicks = () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button onClick={() => setCount((value) => value + 1)}>Click me</Button>
      <form hidden>
        <input data-testid="click-count" readOnly value={String(count)} />
      </form>
    </>
  )
}
```

```ts
test('counts clicks', async ({ mount }) => {
  const component = await mount('Button/CountsClicks')
  await component.getByRole('button', { name: 'Click me' }).click()
  await expect(component.getByTestId('click-count')).toHaveValue('1')
})
```

Playwright starts the Vite dev server automatically and reuses an existing one locally.

## Styling

Tailwind 4 is configured entirely in `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --radius-card: 0.875rem;
  --shadow-card: 0 1px 2px rgb(15 23 42 / 0.06);
}
```

There is no `tailwind.config.js`. Theme variables generate utilities (`rounded-card`,
`shadow-card`). Use the `cn()` helper in `src/lib/cn.ts` to merge conditional classes.

Biome's `useSortedClasses` rule is enabled to keep Tailwind classes in a consistent order. It is
a nursery rule and its fix is marked unsafe, so `pnpm lint:fix` will not reorder classes. To apply
it explicitly:

```sh
pnpm exec biome check --write --unsafe .
```

Biome does not format Markdown, so README files are left as-is.

## Commits

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are checked by
commitlint:

```
<type>(<scope>): <subject>
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`,
`revert`. The subject must be lower-case, imperative, and at most 100 characters.

Examples:

```
feat(button): add secondary variant
fix: prevent double submission
docs: document the gallery story convention
chore(deps): update vite
```

`pre-commit` runs lint-staged, which formats and fixes staged files with Biome. `commit-msg` runs
commitlint. To enable the included commit message template locally:

```sh
git config commit.template .gitmessage
```

Do not use `--no-verify` to skip the hooks; fix the reported issue instead.

## CI

No workflow is committed, but the full check looks like this:

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm build
pnpm build-storybook
pnpm exec playwright install --with-deps chromium
pnpm test:ct
```

## Notes

- `pnpm install` runs Husky's `prepare` script, so the project must be a git repository.
- Vitest runs in jsdom; Playwright runs in Chromium. Keep browser-only behavior in Playwright tests.
- Storybook is documentation-only by default. The Vitest addon can be added later if you want
  stories and play functions to run as browser tests.
- This is a single-package repo, but pnpm 12 keeps supply-chain settings in
  `pnpm-workspace.yaml` (`allowBuilds` for esbuild and release-age exclusions for the freshly
  published Storybook packages). Keep that file in version control.
