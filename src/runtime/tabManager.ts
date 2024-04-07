import type { tab_constructor, Dock } from "./types"
import {v4 as uuidv4} from "uuid"
import {Nuxt_Dock_Events} from "./event_manager"
import {close_tab, tab_clicked, tab_mouse_enter, tab_mouse_leave} from "./scripts/event_handlers/tabs"
import { mouse_move, mouse_up } from "./scripts/event_handlers/pointer";
import { dock_mouse_enter, dock_mouse_leave } from "./scripts/event_handlers/dock";

export function emit_dock_event(event_type: Nuxt_Dock_Events, data: Object) {
    window.dispatchEvent(new CustomEvent(event_type, {
        detail: data
    }))
}

export function update_dock(dock_uuid: string) {
    emit_dock_event(Nuxt_Dock_Events.update_tabs_signal, {
        tab_container_uuid: dock_uuid
    })
}

export function find_dock(dock_uuid: string) {
    const dock = window._nuxt_dock_docks.find((dock) => dock.uuid === dock_uuid);
    if (dock) return dock;
    return null
}

export function setup() {
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

        update_dock(container_uuid);

        if (!dock) return

        emit_dock_event(Nuxt_Dock_Events.update_active_tab_uuid, {
            active_tab_uuid: dock.active_tab_uuid,
            dock_uuid: dock.uuid
        })
    }

    //Listen for events
    window.addEventListener(Nuxt_Dock_Events.tab_clicked, (e: any) => { //Change active tab
        tab_clicked(e.detail.tab_uuid);
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
        close_tab(e.detail.tab_uuid as string)
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

    window.addEventListener(Nuxt_Dock_Events.Nuxt_Dock_pointer_move, (e: any) => {
        mouse_move(e.detail)
    })

    window.addEventListener(Nuxt_Dock_Events.Nuxt_Dock_pointer_up, (e: any) => {
        mouse_up(e.detail);
    })

    window.addEventListener(Nuxt_Dock_Events.Dock_Mouse_Enter, (e: any) => {
        dock_mouse_enter(e.detail.dock_uuid)
    })

    window.addEventListener(Nuxt_Dock_Events.Dock_Mouse_Leave, (e: any) => {
        dock_mouse_leave()
    })
}


export function slide_tabs(dock: Dock | null, start_index: number, move_by_number = -1) {
    if (!dock) return;

    const tabs = window._nuxt_dock_tabManager.filter((tab) => tab.tab_container_uuid === dock.uuid && tab.index > start_index);
    
    tabs.forEach(tab => {
        tab.index += move_by_number;
    });

    update_dock(dock.uuid);
}
