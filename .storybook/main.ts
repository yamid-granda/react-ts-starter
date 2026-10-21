import type { StorybookConfig } from '@storybook/react-vite'
import type { PluginOption } from 'vite'

function isReactRouterPlugin(plugin: PluginOption) {
  return (
    plugin != null &&
    typeof plugin === 'object' &&
    !Array.isArray(plugin) &&
    'name' in plugin &&
    typeof plugin.name === 'string' &&
    plugin.name.startsWith('react-router')
  )
}

function withoutReactRouterPlugins(plugins: PluginOption[]): PluginOption[] {
  return plugins.flatMap((plugin) => {
    if (Array.isArray(plugin)) {
      const nested = withoutReactRouterPlugins(plugin)
      return nested.length > 0 ? [nested] : []
    }

    return isReactRouterPlugin(plugin) ? [] : [plugin]
  })
}

const config: StorybookConfig = {
  stories: ['../app/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(viteConfig) {
    // Storybook loads the project Vite config, but it does not need the React Router plugin.
    if (viteConfig.plugins) {
      viteConfig.plugins = withoutReactRouterPlugins(viteConfig.plugins)
    }

    return viteConfig
  },
}

export default config
