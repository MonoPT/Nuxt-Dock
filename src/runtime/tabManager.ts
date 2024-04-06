import type { tab_constructor, Dock } from "../runtime/composables/types"
import {v4 as uuidv4} from "uuid"
import type { pointer_move_event, pointer_up_event } from "./event_manager";
import {Nuxt_Dock_Events} from "./event_manager"


function emit_dock_event(event_type: Nuxt_Dock_Events, data: Object) {
    window.dispatchEvent(new CustomEvent(event_type, {
        detail: data
    }))
}

function find_dock(dock_uuid: string) {
    const dock = window._nuxt_dock_docks.find((dock) => dock.uuid === dock_uuid);
    if (dock) return dock;
    return null
}

export function setup() {
    window._nuxt_dock_docks = []; //Store all docks
    window._nuxt_dock_tabManager = []; //Array that stores all tab data and parent dock
    window._nuxt_dock_active_tabs = {}; //Object of active tabs
    
    window._nuxt_dock_addTabs = (tab: tab_constructor | tab_constructor[], container_uuid: string) => {
        const tabs: tab_constructor [] = [...<[]>tab];
        const dock = find_dock(container_uuid)

        for (let index = 0; index < tabs.length; index++) {
            const tab = tabs[index];

            const uuid = uuidv4()

            window._nuxt_dock_tabManager.push({
                name: tab.name,
                uuid: uuid,
                tab_container_uuid: container_uuid,
                index,
                iframe_url: tab.iframe_url
            })

            if (tab.is_active_tab) {
                const dock = find_dock(container_uuid)
                if (dock) {
                    dock.active_tab_uuid = uuid
                }
            }
        }

        emit_dock_event(Nuxt_Dock_Events.update_tabs_signal, {
            tab_container_uuid: container_uuid
        })

        if (!dock) return

        emit_dock_event(Nuxt_Dock_Events.update_active_tab_uuid, {
            active_tab_uuid: dock.active_tab_uuid,
            dock_uuid: dock.uuid
        })
    }

    //Listen for events
    window.addEventListener(Nuxt_Dock_Events.tab_clicked, (e) => { //Change active tab
        //@ts-ignore
        const tab_uuid = e.detail.tab_uuid as string;

        const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === tab_uuid);

        if (!tab) return;

        const dock = find_dock(tab.tab_container_uuid);

        if (!dock) return; 

        dock.active_tab_uuid = tab_uuid

        emit_dock_event(Nuxt_Dock_Events.update_active_tab_uuid, {
            active_tab_uuid: dock?.active_tab_uuid,
            dock_uuid: dock.uuid
        })
    })

    window.addEventListener(Nuxt_Dock_Events.register_dock, (e) => { //Register dock
        //@ts-ignore
        const dock_uuid = e.detail.uuid;

        window._nuxt_dock_docks.push({
            uuid: dock_uuid,
            active_tab_uuid: ""
        })
    })

    window.addEventListener(Nuxt_Dock_Events.close_tab, (e) => { //Close tab
        //@ts-ignore
        const tab_uuid = e.detail.tab_uuid as string;

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

        move_tabs_back(dock, tab_index);

        emit_dock_event(Nuxt_Dock_Events.update_tabs_signal, {
            tab_container_uuid: parent_dock_uuid
        })
    })

    window.addEventListener(Nuxt_Dock_Events.mouse_enter, (e) => {
        //@ts-ignore
        const details = e.detail;
        tab_mouse_enter(details.dock_uuid, details.tab_uuid)
    })

    window.addEventListener(Nuxt_Dock_Events.mouse_leave, (e) => {
        //@ts-ignore
        const details = e.detail;
        tab_mouse_leave(details.dock_uuid, details.tab_uuid)
    })

    window.addEventListener(Nuxt_Dock_Events.Nuxt_Dock_pointer_move, (e) => {
        //@ts-ignore
        mouse_move(e.detail)
    })

    window.addEventListener(Nuxt_Dock_Events.Nuxt_Dock_pointer_up, (e) => {
        //@ts-ignore
        mouse_up(e.detail)
    })

    window.addEventListener(Nuxt_Dock_Events.Dock_Mouse_Enter, (e) => {
        //@ts-ignore
        dock_mouse_enter(e.detail.dock_uuid)
    })
}


function move_tabs_back(dock: Dock | null, start_index: number, move_by_number = 1) {
    if (!dock) return;

    window._nuxt_dock_tabManager.filter((tab) => tab.tab_container_uuid === dock.uuid && tab.index > start_index).forEach(tab => {
        tab.index -= move_by_number;
    });
}

function mouse_move(event: pointer_move_event) {
    
}

function mouse_up(event: pointer_up_event) {
    
}

function tab_mouse_enter(dock_uuid: string, tab_uuid: string) {
    
}

function tab_mouse_leave(dock_uuid: string, tab_uuid: string) {
    
}

function dock_mouse_enter(dock_uuid: string) {
    
}
