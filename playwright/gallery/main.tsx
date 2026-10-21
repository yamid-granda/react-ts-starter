import { type ComponentType, StrictMode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot, type Root } from 'react-dom/client'
import '../../app/app.css'

type StoryProps = Record<string, unknown>
type Story = ComponentType<StoryProps>
type MountOptions = { story: string; props?: StoryProps }

const modules = import.meta.glob<Record<string, unknown>>('/app/**/*.story.tsx', {
  eager: true,
})

function toStoryId(file: string) {
  const path = file.replace(/^\/src\//, '').replace(/\.story\.tsx$/, '')
  const segments = path.split('/').filter((segment) => segment !== 'tests')
  const last = segments.at(-1)
  const previous = segments.at(-2)

  if (segments.length > 1 && last === previous) {
    segments.pop()
  }

  return segments.join('/')
}

const stories = new Map<string, Story>()

for (const [file, module] of Object.entries(modules)) {
  const id = toStoryId(file)

  for (const [name, value] of Object.entries(module)) {
    if (typeof value === 'function') {
      stories.set(`${id}/${name}`, value as unknown as Story)
    }
  }
}

function resolveStory(story: string) {
  const exact = stories.get(story)
  if (exact) {
    return exact
  }

  const matches = [...stories.entries()].filter(([id]) => id.endsWith(`/${story}`))

  if (matches.length === 1 && matches[0]) {
    return matches[0][1]
  }

  throw new Error(matches.length > 1 ? `Ambiguous story "${story}"` : `Unknown story "${story}"`)
}

const container = document.getElementById('root')

if (!container) {
  throw new Error('Gallery root element #root not found')
}

const rootElement: HTMLElement = container

let root: Root | null = null

function mount({ story, props = {} }: MountOptions) {
  const Component = resolveStory(story)

  if (!root) {
    root = createRoot(rootElement)
  }

  flushSync(() => {
    root?.render(
      <StrictMode>
        <Component {...props} />
      </StrictMode>,
    )
  })
}

function unmount() {
  root?.unmount()
  root = null
}

window.mount = async (options) => {
  mount(options)
}

window.unmount = unmount
