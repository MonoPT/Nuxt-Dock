import { update_dock } from "../../tabManager";
import { reset_tab_drag, update_tab_index } from "./tabs";

export function dock_mouse_enter(dock_uuid: string) {
    const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === window.window._nuxt_dock_tab_drag.uuid);

    if(!tab) return

    if (tab.tab_container_uuid !== dock_uuid) {
        window._nuxt_dock_tab_drag.dock_when_mouse_up = dock_uuid;
    }



    
}

