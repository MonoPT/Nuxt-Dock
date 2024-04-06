import { defineNuxtModule, addPlugin, createResolver, addComponentsDir, addImportsDir } from '@nuxt/kit'
import { setupDevToolsUI } from './devtools'


// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Enable Nuxt Devtools integration
   * 
   * @default true 
   */
  devtools: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-dock',
    configKey: 'nuxtDock'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    devtools: true
  },
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)
    
    //Plugins
    addPlugin(resolver.resolve('./runtime/plugin'));
    
    //Composables
    addImportsDir(resolver.resolve('runtime/composables'))

    if (options.devtools) setupDevToolsUI(nuxt, resolver)
    
    //Define components folder
    addComponentsDir({
      path: resolver.resolve('runtime/components')
    })
  }
})
