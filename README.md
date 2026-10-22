# React + TypeScript Starter

A small, opinionated frontend scaffold with the tooling already wired together:

- **React 19** + **TypeScript 7** + **Vite 8**
- **React Router 8** in framework mode with file-based routing and SPA output
- **Tailwind CSS 4** via `@tailwindcss/vite` (CSS-first configuration)
- **Biome 2** for formatting, linting and import sorting
- **Storybook 10** for component documentation
- **Vitest 5** + **Testing Library** + **jsdom** for fast behavior tests
- **MSW 3** for HTTP-level test mocks
- **Playwright 1.64** for real-browser component tests
- **Zustand 5** for local state
- **TanStack Query 5** for server state
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

The app runs at <http://localhost:5173> with a home page at `/`, a dummy page at `/other` and a
TanStack Query demo at `/tasks`.
`pnpm test:ct` starts a separate Vite server for the Playwright component gallery at
<http://localhost:5175/playwright/gallery/index.html>.

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the React Router dev server |
| `pnpm build` | Type-check and build for production into `build/client` |
| `pnpm preview` | Preview the production SPA build |
| `pnpm typecheck` | Generate route types and run the TypeScript build |
| `pnpm typegen` | Generate React Router route types only |
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
├── app/
│   ├── clients/
│   │   └── serverState/index.ts       # TanStack Query client
│   ├── configs/
│   │   └── queryKeys/index.ts         # centralized query keys
│   ├── components/Button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx        # Storybook
│   │   └── tests/
│   │       ├── Button.story.tsx      # Playwright gallery story
│   │       ├── Button.test.tsx       # Vitest + RTL
│   │       └── Button.spec.ts        # Playwright spec
│   ├── routes/
│   │   ├── _index.tsx                 # /
│   │   ├── other/
│   │   │   └── route.tsx              # /other layout
│   │   ├── other._index/
│   │   │   └── route.tsx              # /other
│   │   ├── other.inner-page/
│   │   │   └── route.tsx              # /other/inner-page
│   │   └── tasks/
│   │       ├── route.tsx              # /tasks
│   │       └── tests/route.test.tsx
│   ├── services/
│   │   └── api/tasks/
│   │       ├── types.ts               # shared Todo type
│   │       └── getTasks/
│   │           ├── index.ts           # JSONPlaceholder fetcher
│   │           ├── useGetTasks.ts     # query options + useQuery hook
│   │           └── tests/getTodos.test.ts
│   ├── stores/counter.ts             # Zustand store
│   ├── test/
│   │   ├── msw/
│   │   │   ├── handlers.ts            # default URL + method handlers
│   │   │   └── server.ts              # setupServer(...handlers)
│   │   └── setup.ts                   # jest-dom, RTL cleanup, MSW lifecycle
│   ├── utils/cn.ts                   # clsx + tailwind-merge
│   ├── app.css
│   ├── root.tsx                      # document shell, nav, <Outlet />
│   ├── root.test.tsx
│   └── routes.ts                     # file-based route config
├── playwright/gallery/         # Playwright component gallery
├── react-router.config.ts      # SPA mode (`ssr: false`)
├── vite.playwright.config.ts   # plain Vite config for the gallery
└── playwright.config.ts
```

The `@/` alias points at `app/` in TypeScript, Vite, Vitest and Playwright.

The folders are layered: `routes/` compose pages, `components/` holds UI, `services/api/` holds
API business operations, `clients/` wires technical clients such as TanStack Query, `utils/` holds
generic helpers, and `stores/` holds local UI state. API operations live at
`app/services/api/<domain>/<operation>/index.ts` with tests colocated in `tests/`; shared types
live at the domain root.

## Routing

Routes are discovered from files and folders in `app/routes/` through
[`@react-router/fs-routes`](https://reactrouter.com/how-to/file-route-conventions):

| File | URL |
| --- | --- |
| `app/routes/_index.tsx` | `/` |
| `app/routes/other/route.tsx` | layout for `/other` |
| `app/routes/other._index/route.tsx` | `/other` |
| `app/routes/other.inner-page/route.tsx` | `/other/inner-page` (child of `other/route.tsx`) |
| `app/routes/tasks/route.tsx` | `/tasks` |
| `app/routes/blog.post.tsx` | `/blog/post` |
| `app/routes/blog.$slug.tsx` | `/blog/:slug` |
| `app/routes/_auth.login.tsx` | `/login` (inside `_auth.tsx`) |

`app/root.tsx` is the document shell and shared layout. It renders the nav and an `<Outlet />`
where the matched route appears. `app/routes.ts` wires up the file convention:

```ts
import type { RouteConfig } from '@react-router/dev/routes'
import { flatRoutes } from '@react-router/fs-routes'

export default flatRoutes({
  ignoredRouteFiles: ['**/*.test.*', '**/*.stories.*'],
}) satisfies RouteConfig
```

Keep tests and stories outside `app/routes/` (or use a folder with a `route.tsx` inside) so they
are not treated as routes.

Routes can be files or folders. A route folder uses `route.tsx` as its module, and other files in
that folder are not routes, so tests and helpers can live next to the route. For example,
`tasks/route.tsx` is the `/tasks` route and `tasks/tests/route.test.tsx` is ignored by the router.
The folder or file name defines the URL: `other.inner-page/route.tsx` is the child route
`/other/inner-page`, while `other._index/route.tsx` is the `/other` index rendered inside the
`<Outlet />` of `other/route.tsx`. The `other/route.tsx` layout provides the Overview / Inner page
sub-nav for both routes.

`react-router.config.ts` sets `ssr: false`, so `pnpm build` produces a static SPA in `build/client`
plus a generated `index.html`. Deploy that directory with a rewrite from every path to
`index.html` so deep links such as `/other/inner-page` work:

```
/*    /index.html   200
```

Unknown paths fall through to React Router's default error page; this starter does not define a
custom 404 route.

## Testing strategy

There are three deliberately separate layers:

| Layer | Tool | Files | Environment |
| --- | --- | --- | --- |
| Behavior | Vitest + RTL + user-event | `app/**/*.test.tsx` | jsdom |
| Documentation | Storybook | `app/**/*.stories.tsx` | browser |
| Real browser | Playwright `mount()` | `app/components/**/tests/*.spec.ts` | Chromium |

### Unit and behavior tests

Use Testing Library queries and `user-event`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { Button } from '../Button'

it('calls onClick', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()

  render(<Button onClick={onClick}>Save</Button>)
  await user.click(screen.getByRole('button', { name: 'Save' }))

  expect(onClick).toHaveBeenCalledOnce()
})
```

`@testing-library/jest-dom` matchers are registered globally in `app/test/setup.ts`.

Route components and navigation are tested with React Router's `createRoutesStub`:

```tsx
import { createRoutesStub } from 'react-router'

const Stub = createRoutesStub([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: 'other', Component: Other },
    ],
  },
])

render(<Stub initialEntries={['/']} />)
```

Tests that render a query page wrap it in a fresh `QueryClientProvider` with retries disabled.
Network requests are intercepted by MSW instead of mocking service modules. Handlers live in
`app/test/msw/handlers.ts` and match by URL + method, so route tests keep working if a service
function is renamed. Individual tests override handlers with `server.use(...)`, and an unhandled
request fails the suite.

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
gallery page that a separate Vite config serves:

- `app/**/tests/*.story.tsx` exports one React component per scenario.
- `playwright/gallery/main.tsx` discovers those exports and exposes `window.mount()`.
- `app/**/tests/*.spec.ts` calls `mount('Button/Primary')` and asserts against the page.

Story IDs are derived from the file path and export name. The `tests` segment is ignored, so
`app/components/Button/tests/Button.story.tsx` becomes `components/Button/<Export>`, and unique
suffixes such as `Button/Primary` also work.

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

Playwright starts the gallery's Vite server automatically with `vite.playwright.config.ts` and
reuses an existing one locally.

## State management

Global state lives in Zustand stores under `app/stores/`. Select state and actions separately so
components only re-render for the values they use:

```ts
import { useCounterStore } from '@/stores/counter'

const count = useCounterStore((state) => state.count)
const increment = useCounterStore((state) => state.increment)
```

Stores are module-level, so reset them between tests:

```ts
beforeEach(() => {
  useCounterStore.setState(useCounterStore.getInitialState(), true)
})
```

## Server state (TanStack Query)

Server state is handled by [TanStack Query](https://tanstack.com/query). The client factory lives in
`app/clients/serverState/index.ts` and is called once per app instance in `app/root.tsx`, then
provided through `QueryClientProvider`. The defaults are a 30 second stale time, one retry, and no
refetch on window focus.

Query options and the hook live next to the API operation, so components share the same key,
fetcher and types. Query keys are centralized in `app/configs/queryKeys/index.ts`:

```tsx
import { getTodosQueryKey } from '@/configs/queryKeys'
import { useGetTasks } from '@/services/api/tasks/getTasks/useGetTasks'

// Inside the operation's query options:
queryKey: getTodosQueryKey(),

const { data, isPending, isError, refetch } = useGetTasks()
```

The hook wraps `useQuery` with `todosQuery`; `todosQuery` is also exported for prefetching or
invalidation.

The `/tasks` page is a complete example with loading, error, retry and refresh states. It calls the
public JSONPlaceholder API, so running that page needs network access; the unit tests intercept the
HTTP request with MSW. Because the query is cached for 30 seconds, navigating away and back reuses
the previous result.

Use TanStack Query for remote data and keep Zustand for local UI state. React Router loaders are
still available, but in this SPA setup the demo keeps data fetching inside the route component.

## Styling

Tailwind 4 is configured entirely in `app/app.css`:

```css
@import "tailwindcss";

@theme {
  --radius-card: 0.875rem;
  --shadow-card: 0 1px 2px rgb(15 23 42 / 0.06);
}
```

There is no `tailwind.config.js`. Theme variables generate utilities (`rounded-card`,
`shadow-card`). Use the `cn()` helper in `app/utils/cn.ts` to merge conditional classes.

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
- React Router generates route types in `.react-router/`; the directory is ignored and regenerated
  by `pnpm dev`, `pnpm typecheck` and `pnpm build`.
- Vitest runs in jsdom; Playwright runs in Chromium. Keep browser-only behavior in Playwright tests.
- Storybook is documentation-only by default. The Vitest addon can be added later if you want
  stories and play functions to run as browser tests.
- This is a single-package repo, but pnpm 12 keeps supply-chain settings in
  `pnpm-workspace.yaml` (`allowBuilds` for esbuild and release-age exclusions for the freshly
  published Storybook packages). Keep that file in version control.
