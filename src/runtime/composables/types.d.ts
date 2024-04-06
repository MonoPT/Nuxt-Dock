export type Tab = {
    name: string,
    uuid: string,
    tab_container_uuid: string,
    index: number,
    iframe_url: string
}

export type tab_constructor = {
    name: string,
    iframe_url: string,
    is_active_tab?: boolean
}

export type Dock = {
    uuid: string,
    active_tab_uuid: string
}

interface Active_tabs {
    [dock_uuid: string]: string;
}

export declare global {
    interface Window { 
        _nuxt_dock_tabManager: Tab[]; 
        _nuxt_dock_addTabs: Function;
        _nuxt_dock_docks: Dock[];
        _nuxt_dock_active_tabs: Active_tabs;
    }
}


