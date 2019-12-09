import { NavTrack } from '../interfaces';

export const createGridTrack: NavTrack = {
    name: "create-grid",
    start: "grid-start",
    nodes: [
        {
            name: "grid-start",
            type: "route",
            value: "/grid-start",
            actions: {
                "continue": "grid-editor",
            }
        },
        {
            name: "grid-editor",
            type: "route",
            value: "/grid-editor",
            actions: {
                "continue": "publish",
                "authenticate": "publish-login",
            }
        },
        {
            name: "publish-login",
            type: "route",
            value: "/publish-login",
            actions: {
                "continue": "publish",
                "back": "grid-editor",
            }
        },
        {
            name: "publish",
            type: "route",
            value: "/publish",
            actions: {
                "authenticate": "publish-login",
                "continue": "publish-complete",
                "back": "grid-editor",
            }
        },
        {
            name: "publish-complete",
            type: "route",
            value: "/publish-complete",
            actions: {}
        },

    ],
}
