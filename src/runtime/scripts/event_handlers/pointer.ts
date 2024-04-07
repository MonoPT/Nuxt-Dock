import { Nuxt_Dock_Events, type pointer_move_event, type pointer_up_event } from "../../event_manager";
import { emit_dock_event, find_dock, slide_tabs, update_dock } from "../../tabManager";
import { reset_tab_drag, update_tab_index } from "./tabs";

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

    if(window._nuxt_dock_tab_drag.dock_when_mouse_up.length > 0) {
        change_dock_reset()

        return
    }

    normal_reset_mouse_up()
}

const reset_tab_indexes = () => {
    if (!window._nuxt_dock_tab_drag.is_detached || window._nuxt_dock_tab_drag.ignore_reset) return;

    const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === window._nuxt_dock_tab_drag.uuid);

    if(!tab) return;

    const dock = find_dock(tab.tab_container_uuid);
    slide_tabs(dock, window._nuxt_dock_tab_drag.original_index - 1, + 1);

    tab.index = window._nuxt_dock_tab_drag.original_index;
}

function normal_reset_mouse_up() {
    emit_dock_event(Nuxt_Dock_Events.reset_tab_position, {
        uuid: window._nuxt_dock_tab_drag.uuid
    });

    reset_tab_indexes();
    reset_tab_drag();
}

function change_dock_reset() {
    //Change owing dock if is being dragged
    const dock_uuid = window._nuxt_dock_tab_drag.dock_when_mouse_up;

    if (!window._nuxt_dock_tab_drag.is_detached) return;

    const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === window.window._nuxt_dock_tab_drag.uuid);

    if(!tab || tab.tab_container_uuid === dock_uuid) return;

    const old_dock_uuid = tab.tab_container_uuid;

    const tabs_in_new_dock = window._nuxt_dock_tabManager.filter((tab) => tab.tab_container_uuid === dock_uuid);

    window._nuxt_dock_tab_drag.ignore_reset = true;

    tab.tab_container_uuid = dock_uuid;
    tab.index = tabs_in_new_dock.length;

    reset_tab_drag();
    update_tab_index(tab.index, tab.uuid);

    update_dock(old_dock_uuid);
    update_dock(dock_uuid);
}