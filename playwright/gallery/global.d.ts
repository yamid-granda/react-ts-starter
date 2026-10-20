export {}

declare global {
  interface Window {
    mount: (options: { story: string; props?: Record<string, unknown> }) => Promise<void>
    unmount: () => void
  }
}
