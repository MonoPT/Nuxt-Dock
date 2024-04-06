<template>
  <div class="nuxt_dock dock-wrapper">
    <div class="nuxt_dock bar-wrapper">
      <div 
        class="tabs-wrapper nuxt_dock"
        @mouseenter="handle_mouse_enter"
      >
        <nd-tab 
          v-for="_tab in tabs_list" 
          :key="_tab.uuid"
          :index="_tab.index"
          :tab-data="_tab"
          :active-tab="active_tab_uuid"
        >
          {{ _tab.name }}
        </nd-tab>
      </div>
    </div>
    <div class="nuxt_dock dock-content">
      <iframe 
        v-for="_tab in tabs_list"
        v-show="_tab.uuid === active_tab_uuid"
        :key="_tab.uuid"
        :src="_tab.iframe_url" 

        frameborder="0"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {onMounted, ref, watch} from "vue";
  import {v4 as uuidv4} from "uuid"
  import { Nuxt_Dock_Events } from "../event_manager";
import type { Tab } from "../types";

  const props = defineProps({
    tabs: {
      required: false,
      default: () => [],
      type: Array
    }
  });

  const dock_uuid = uuidv4();
  const tabs_list = ref<Tab[]>([])
  const active_tab_uuid = ref("");

  onMounted(() => {
    window.dispatchEvent(new CustomEvent(Nuxt_Dock_Events.register_dock, {
      detail: {
        uuid: dock_uuid
      }
    }))
  })

  watch(active_tab_uuid, (new_v) => {
    update_window_reference_to_active_tab_in_dock(new_v);
  });

  const update_window_reference_to_active_tab_in_dock = (tab_uuid: string) => {
    window._nuxt_dock_active_tabs[dock_uuid] = tab_uuid;
  }

  onMounted(() => { //Update tabs whenever there is a change
    window.addEventListener(Nuxt_Dock_Events.update_tabs_signal, (event) => {
      //@ts-ignore
      const details = event.detail;
      
      if (dock_uuid !== details.tab_container_uuid ) return;

      tabs_list.value.length = 0;

      tabs_list.value = window._nuxt_dock_tabManager.filter((tab: Tab) => tab.tab_container_uuid === dock_uuid);
    })

    window.addEventListener(Nuxt_Dock_Events.update_active_tab_uuid, (event) => {
      //@ts-ignore
      const details = event.detail;

      if (details.dock_uuid !== dock_uuid) return

      active_tab_uuid.value = details.active_tab_uuid;

      update_window_reference_to_active_tab_in_dock(details.active_tab_uuid);
    })
  })

  const handle_mouse_enter = () => {
    window.dispatchEvent(new CustomEvent(Nuxt_Dock_Events.Dock_Mouse_Enter, {
      detail: {
        dock_uuid: dock_uuid
      }
    }))
  }

  onMounted(() => { //Register tabs from props
    //@ts-ignore
    window._nuxt_dock_addTabs(props.tabs, dock_uuid); //Add default tabs
  })
</script>

<style lang="scss">
  .nuxt_dock {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    user-select: none;

    /*Dock container*/
    --dock-area-background: #000C18;
    --tabs-container-background: #1C1C2A;

    /*Tab bars*/
    --tab-bar-container-height: 35px;
    --tabs-container-inline-padding: 2rem;

    /*Tabs*/
    --tab-width: 160px;
    --tab-gap-from-top: 4px;
    --tab-background-color: #10192C;
    --tab-border: #2B2B4A;
    --tabs-gap: 2px;
    --tab-boder-radius: .5rem;
    --tab-active-background: #000C18;
    --tab-hover-background: #1e2f55;

    --text-color: #fff;
  }
</style>

<style lang="scss" scoped>
  .dock-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    color: var(--text-color);

    background-color: var(--dock-area-background);
  }

  .bar-wrapper {
    display: block;
    justify-content: end;
    width: 100%;
    height: var(--tab-bar-container-height);
    background: var(--tabs-container-background);
    padding-inline: var(--tabs-container-inline-padding);

    .tabs-wrapper {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      z-index: 2;
    }
  }

  .dock-content {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 0;

    iframe {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
