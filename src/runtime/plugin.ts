import { defineNuxtPlugin } from '#app'
import { setup } from './tabManager'
import {setup_mouse} from "./event_manager";



export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook('app:beforeMount', () => {
    window._nuxt_dock_docks = []; //Store all docks
    window._nuxt_dock_tabManager = []; //Array that stores all tab data and parent dock
    window._nuxt_dock_active_tabs = {}; //Object of active tabs
    window._nuxt_dock_tab_drag = {
        uuid: "",
        x: 0,
        y: 0,
        is_detached: false,
        original_index: 0,
        ignore_reset: false,
        dock_when_mouse_up: ""
    };

  
    setup_mouse();
    setup();
  });
})
