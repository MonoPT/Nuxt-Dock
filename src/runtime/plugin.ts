import { defineNuxtPlugin } from '#app'
import { setup } from './tabManager'
import {setup_mouse} from "./event_manager";



export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook('app:beforeMount', () => {
    setup_mouse();
    setup();
  });
})