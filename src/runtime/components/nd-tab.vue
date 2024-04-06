<template>
  <div 
    class="nuxt_dock tab" 
    :class="{border, isActive: tab_uuid === props.activeTab, is_being_dragged}"
    @pointerdown="handle_tab_click"
    @mouseenter="handle_mouse_enter"
    @mouseleave="handle_mouse_leave"
  >
    <slot /> <close_btn @click.stop="handle_close" />
  </div>
</template>

<script lang="ts" setup>
  import {computed, ref, onMounted} from "vue"
  import close_btn from "../local_components/close_btn.vue"
  import { Nuxt_Dock_Events } from "../event_manager";

  const props = defineProps({
    index: {
      type: Number,
      required: true
    },
    tabData: {
      type: Object,
      required: true
    },
    activeTab: {
      required: true,
      type: String
    }
  })

  const tab_uuid = props.tabData.uuid as string;

  const border = computed(() => props.index > 0)
  const use_gap = computed(() => props.index > 0 ? 1 : 0);

  //Dragged variables
  const x = ref(0);
  const y = ref(0);
  const is_being_dragged = ref(false);
  const original_index = ref(0);

  //Tab events
  const handle_tab_click = () => {
    window.dispatchEvent(new CustomEvent(Nuxt_Dock_Events.tab_clicked, {
      detail: {
        tab_uuid,
        dock_uuid: tab_uuid
      }
    }));
  }

  const handle_mouse_enter = () => {
    window.dispatchEvent(new CustomEvent(Nuxt_Dock_Events.mouse_enter, {
      detail: {
        tab_uuid,
        dock_uuid: tab_uuid
      }
    }))
  }

  const handle_mouse_leave = () => {
    window.dispatchEvent(new CustomEvent(Nuxt_Dock_Events.mouse_leave, {
      detail: {
        tab_uuid,
        dock_uuid: tab_uuid
      }
    }))
  }

  const handle_close = () => {
    window.dispatchEvent(new CustomEvent(Nuxt_Dock_Events.close_tab, {
      detail: {
        tab_uuid
      }
    }))
  }

  onMounted(() => {
    window.addEventListener(Nuxt_Dock_Events.update_tab_position, (e: any) => {
      const tab_data: {x: number, y: number, tab_uuid: string, original_index:number} = e.detail;

      if (tab_data.tab_uuid !== tab_uuid) return

      x.value = tab_data.x;
      y.value = tab_data.y;
      is_being_dragged.value = true;
      original_index.value = tab_data.original_index
    })
  })

  onMounted(() => { //Reset dragged position
    window.addEventListener(Nuxt_Dock_Events.reset_tab_position, (e: any) => {
      if (e.detail.uuid === tab_uuid) {
        x.value = 0;
        y.value = 0;
      }

      is_being_dragged.value = false;
    })
  })

</script>

<style lang="scss" scoped>
  .tab :deep(svg) {
    --bg-opacity: 0;

    display: block;
    color: var(--text-color);
    fill: var(--text-color);
    transition: inherit;
    width: 20px;
    aspect-ratio: 1 / 1;
    pointer-events: all;
    background: rgba(255,255,255, var(--bg-opacity));
    padding: .1rem;
    border-radius: .1rem;

    &:hover {
      --bg-opacity: .1;
    }
  }

.tab {
  --index: v-bind(index);

  display: flex;
  position: absolute;
  align-items: center;
  justify-content: space-around;
  cursor: grab;
  bottom: 0;
  left: calc(
    (var(--tab-width) * var(--index)) + 
    (var(--tabs-gap) * v-bind(use_gap) * var(--index))
  );
  background-color: var(--tab-background-color);
  height: calc(100% - var(--tab-gap-from-top));
  width: var(--tab-width);
  border-top-left-radius: var(--tab-boder-radius);
  border-top-right-radius: var(--tab-boder-radius);
  transition: .12s;
  translate: calc(1px * v-bind(x)) calc(1px * v-bind(y));

  * { //Disable pointer events for children
    pointer-events: none;
  }

  &:not(.isActive):hover {
    background-color: var(--tab-hover-background);
  }

  &.isActive {
    background-color: var(--tab-active-background);
    z-index: 3;
  }

  &.is_being_dragged {
    transition: 0s;
    z-index: 99;
    --index: v-bind(original_index);
    pointer-events: none;
  }
}
</style>