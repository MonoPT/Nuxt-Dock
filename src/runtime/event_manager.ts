//App events
export enum Nuxt_Dock_Events {
    update_active_tab_uuid = "updateActiveTabUUID",
    update_tabs_signal = "updateTabs",
    tab_clicked = "tabClicked",
    close_tab = "closeTab",
    register_dock = "RegisterDock",
    mouse_enter = "mouseEnter",
    mouse_leave = "mouseLeave",
    Nuxt_Dock_pointer_move= "NuxtDockPointerMove",
    Nuxt_Dock_pointer_up= "NuxtDockPointerUp",
    Dock_Mouse_Enter = "Dock_Mouse_Enter"
}


//
//Pointer events data
//
export type pointer_up_event = {
    event_type: Nuxt_Dock_Events.Nuxt_Dock_pointer_up,
}

export type pointer_move_event = {
    event_type: Nuxt_Dock_Events.Nuxt_Dock_pointer_move,
    movementX: number,
    movementY: number,
    screenX: number,
    screenY: number
}

export function setup_mouse() {

    /**
    * Send event from iframes to main window
    */

    window.addEventListener("pointermove", (e) => {
        
        const event: pointer_move_event = {
            event_type: Nuxt_Dock_Events.Nuxt_Dock_pointer_move,
            movementX: e.movementX,
            movementY: e.movementY,
            screenX: e.screenX,
            screenY: e.screenY
        }

        window.parent.postMessage(event, "*");
    });

    window.addEventListener("pointerup", () => {
        const event = {
            event_type: Nuxt_Dock_Events.Nuxt_Dock_pointer_up
        }

        window.parent.postMessage(event, "*");
    })


    /**
    * Trigger event from main window
    */

    window.addEventListener('message', function(event) { 
        const event_to_trigger = event.data.event_type;

        if (!event_to_trigger) return;

        window.dispatchEvent(new CustomEvent(event_to_trigger, {
            detail: event.data
        }));
    });
}

