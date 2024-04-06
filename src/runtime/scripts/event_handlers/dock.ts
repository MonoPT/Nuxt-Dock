import { update_dock } from "../../tabManager";

export function dock_mouse_enter(dock_uuid: string) {
    //Change owing dock if is being dragged
    if (!window._nuxt_dock_tab_drag.is_detached) return;

    const tab = window._nuxt_dock_tabManager.find((tab) => tab.uuid === window.window._nuxt_dock_tab_drag.uuid);

    if(!tab || tab.tab_container_uuid === dock_uuid) return;

    const old_dock_uuid = tab.tab_container_uuid;

    const tabs_in_new_dock = window._nuxt_dock_tabManager.filter((tab) => tab.tab_container_uuid === dock_uuid);

    window._nuxt_dock_tab_drag.ignore_reset = true;

    tab.tab_container_uuid = dock_uuid;
    tab.index = tabs_in_new_dock.length;

    update_dock(old_dock_uuid);
    update_dock(dock_uuid);
}

