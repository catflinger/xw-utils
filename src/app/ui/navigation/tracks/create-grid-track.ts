import { NavTrack } from '../interfaces';

export const createGridTrack: NavTrack = {
    name: "create-grid",
    start: "grid-start",
    nodes: [
        {
            name: "grid-start",
            type: "route",
            route: "/grid-start",
            actions: {
                "continue": "grid-editor",
            }
        },
        {
            name: "grid-editor",
            type: "route",
            route: "/grid-editor",
            actions: {
                "continue": "publish",
                "authenticate": "publish-login",
            }
        },
        {
            name: "publish-login",
            type: "route",
            route: "/publish-login",
            actions: {
                "continue": "publish",
                "back": "grid-editor",
            }
        },
        {
            name: "publish",
            type: "route",
            route: "/publish",
            actions: {
                "authenticate": "publish-login",
                "continue": "publish-complete",
                "back": "grid-editor",
            }
        },
        {
            name: "publish-complete",
            type: "route",
            route: "/publish-complete",
            actions: {}
        },

    ],
}
