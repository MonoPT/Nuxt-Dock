import { Nuxt_Dock_Events, type pointer_move_event, type pointer_up_event } from "../../event_manager";
import { emit_dock_event, find_dock, slide_tabs, update_dock } from "../../tabManager";

export function mouse_move(event: pointer_move_event) {
    if (window._nuxt_dock_tab_drag.uuid.length <= 0) return;

    const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === window._nuxt_dock_tab_drag.uuid);

    if(!tab) return;

    window._nuxt_dock_tab_drag.x += event.movementX
    window._nuxt_dock_tab_drag.y += event.movementY

    if (
        (!window._nuxt_dock_tab_drag.is_detached) &&
        (Math.abs(window._nuxt_dock_tab_drag.x) < 20 && Math.abs(window._nuxt_dock_tab_drag.y) < 20)
    ) return;

    let index = tab.index;

    if (window._nuxt_dock_tab_drag.is_detached) {
        index = window.window._nuxt_dock_tab_drag.original_index
    }

    emit_dock_event(Nuxt_Dock_Events.update_tab_position, {
        tab_uuid: window._nuxt_dock_tab_drag.uuid,
        x: window._nuxt_dock_tab_drag.x,
        y: window._nuxt_dock_tab_drag.y,
        original_index: index
    });

    //Run this if tab is not detached
    if (window._nuxt_dock_tab_drag.is_detached) return;
    window._nuxt_dock_tab_drag.is_detached = true

    window._nuxt_dock_tab_drag.original_index = tab.index;

    tab.index = -1;

    const dock = find_dock(tab.tab_container_uuid);

    slide_tabs(dock, window._nuxt_dock_tab_drag.original_index);
}

export function mouse_up(event: pointer_up_event) {
    emit_dock_event(Nuxt_Dock_Events.reset_tab_position, {
        uuid: window._nuxt_dock_tab_drag.uuid
    });

    reset_tab_indexes();

    const new_data = {
        x: 0,
        y: 0,
        uuid: "",
        is_detached: false,
        original_index: 0,
        ignore_reset: false
    }

    window._nuxt_dock_tab_drag = new_data;    
}

const reset_tab_indexes = () => {
    if (!window._nuxt_dock_tab_drag.is_detached || window._nuxt_dock_tab_drag.ignore_reset) return;

    const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === window._nuxt_dock_tab_drag.uuid);

    if(!tab) return;

    const dock = find_dock(tab.tab_container_uuid);
    slide_tabs(dock, window._nuxt_dock_tab_drag.original_index - 1, + 1);

    tab.index = window._nuxt_dock_tab_drag.original_index;
}