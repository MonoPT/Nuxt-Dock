import { Nuxt_Dock_Events, type pointer_move_event, type pointer_up_event } from "../../event_manager";
import { emit_dock_event, find_dock, slide_tabs, update_dock } from "../../tabManager";
import type { Tab } from "../../types";
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
    if(window._nuxt_dock_tab_drag.last_tab_hovered_uuid.length > 0) { //Change index and dock
        const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === window._nuxt_dock_tab_drag.uuid);
        const other_tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === window._nuxt_dock_tab_drag.last_tab_hovered_uuid);

        if(!tab || !other_tab) {
            normal_reset_mouse_up()
            return
        }

        if (tab.tab_container_uuid === other_tab.tab_container_uuid) {
            change_index_position(other_tab.index, tab)
            return
        }
        
        take_tab_index_in_dock()

        return;
    } else
    if(window._nuxt_dock_tab_drag.dock_when_mouse_up.length > 0) { //change dock
        change_dock_reset()
        return
    }

    //dont do anything
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

function take_tab_index_in_dock() {
    const tab_to_replace = window._nuxt_dock_tabManager.find((tab) => tab.uuid === window._nuxt_dock_tab_drag.last_tab_hovered_uuid);

    if(!tab_to_replace) {
        normal_reset_mouse_up();
        return;
    }

    const dock_uuid = tab_to_replace.tab_container_uuid

    window._nuxt_dock_tab_drag.dock_when_mouse_up = dock_uuid;

    const dock = find_dock(dock_uuid);

    if(!dock) {
        normal_reset_mouse_up();
        return;
    }

    const old_tab_index = tab_to_replace.index;

    const dragged_tab_uuid = window._nuxt_dock_tab_drag.uuid;

    change_dock_reset();

    
    const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === dragged_tab_uuid);

    if(!tab) return;

    slide_tabs(dock, tab_to_replace.index - 1, + 1);

    tab.index = old_tab_index;

    update_dock(dock_uuid);
}

function change_index_position(new_index: number, tab: Tab) {
    const dock = find_dock(tab.tab_container_uuid);

    if(!dock) {
        normal_reset_mouse_up();
        return
    }

    const tabs = window._nuxt_dock_tabManager.filter((Tab) => Tab.tab_container_uuid === tab.tab_container_uuid);

    const other_tab = tabs.find((tab) => tab.index === new_index);

    if (!other_tab) {
        normal_reset_mouse_up();
        return
    }

    window._nuxt_dock_tab_drag.ignore_reset = true;
    normal_reset_mouse_up();
    slide_tabs(dock, new_index - 1, + 1);

    tab.index = new_index;
    update_dock(tab.tab_container_uuid);
}