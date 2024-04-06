import { Nuxt_Dock_Events, type pointer_up_event } from "../../event_manager";
import { emit_dock_event, find_dock, slide_tabs } from "../../tabManager";

export function close_tab(tab_uuid: string) {
    const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === tab_uuid);

    if(!tab) return;

    const tab_index = tab.index;

    const parent_dock_uuid = tab.tab_container_uuid;

    const tabs_in_dock = window._nuxt_dock_tabManager.filter((tab) => tab.tab_container_uuid === parent_dock_uuid);

    //Select a new active tab if tab to be removed is the active one

    const dock = find_dock(tab.tab_container_uuid);

    if (dock && dock.active_tab_uuid === tab_uuid && tabs_in_dock.length > 1) {
        if (dock.active_tab_uuid === tab_uuid) {
            if (tab.index === 0) {
                dock.active_tab_uuid = tabs_in_dock[1].uuid;
            } else if (tab.index === tabs_in_dock.length - 1) {
                dock.active_tab_uuid = tabs_in_dock[tabs_in_dock.length - 2].uuid;
            } else if (tabs_in_dock.length > 1){
                dock.active_tab_uuid = tabs_in_dock[tab.index + 1].uuid;
            }
        }
        
        //Update active tab
        emit_dock_event(Nuxt_Dock_Events.update_active_tab_uuid, {
            active_tab_uuid: dock.active_tab_uuid,
            dock_uuid: dock.uuid
        })
    }

    
    //Remove tab
    window._nuxt_dock_tabManager = window._nuxt_dock_tabManager.filter((tab) => {
        return tab.uuid !== tab_uuid
    });

    slide_tabs(dock, tab_index);
}

export function tab_clicked(tab_uuid: string) {
    const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === tab_uuid);

    if (!tab) return;

    window._nuxt_dock_tab_drag.uuid = tab_uuid;

    const dock = find_dock(tab.tab_container_uuid);

    if (!dock) return; 

    dock.active_tab_uuid = tab_uuid

    emit_dock_event(Nuxt_Dock_Events.update_active_tab_uuid, {
        active_tab_uuid: dock?.active_tab_uuid,
        dock_uuid: dock.uuid
    })
}

export function tab_mouse_enter(dock_uuid: string, tab_uuid: string) {
    console.log("entered tab")
}

export function tab_mouse_leave(dock_uuid: string, tab_uuid: string) {
    
}