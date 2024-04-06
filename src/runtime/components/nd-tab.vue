<template>
  <div 
    class="nuxt_dock tab" 
    :class="{border, isActive: tab_uuid === props.activeTab}"
    @click="handle_tab_click"
    @mouseenter="handle_mouse_enter"
    @mouseleave="handle_mouse_leave"
  >
    <slot /> <close_btn @click.stop="handle_close" />
  </div>
</template>

<script lang="ts" setup>
  import {computed} from "vue"
  import close_btn from "../local_components/close_btn.vue"

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

  //Tab events
  const handle_tab_click = () => {
    window.dispatchEvent(new CustomEvent("tabClicked", {
      detail: {
        tab_uuid,
        dock_uuid: tab_uuid
      }
    }))
  }

  const handle_mouse_enter = () => {
    window.dispatchEvent(new CustomEvent("mouseEnter", {
      detail: {
        tab_uuid,
        dock_uuid: tab_uuid
      }
    }))
  }

  const handle_mouse_leave = () => {
    window.dispatchEvent(new CustomEvent("mouseLeave", {
      detail: {
        tab_uuid,
        dock_uuid: tab_uuid
      }
    }))
  }

  const handle_close = () => {
    window.dispatchEvent(new CustomEvent("closeTab", {
      detail: {
        tab_uuid
      }
    }))
  }

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
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: space-around;
  cursor: grab;
  bottom: 0;
  left: calc(
    (var(--tab-width) * v-bind(index)) + 
    (var(--tabs-gap) * v-bind(use_gap) * v-bind(index))
  );
  background-color: var(--tab-background-color);
  height: calc(100% - var(--tab-gap-from-top));
  width: var(--tab-width);
  border-top-left-radius: var(--tab-boder-radius);
  border-top-right-radius: var(--tab-boder-radius);
  transition: .12s;

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
}
</style>