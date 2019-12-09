import { NavTrack } from '../interfaces';

export const publishGridTrack: NavTrack = {
    name: "publish-grid",
    start: "publish-grid",
    nodes: [
        {
            name: "publish-grid",
            type: "route",
            route: "/publish-grid",
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
                "back": "publish-grid",
            }
        },
        {
            name: "publish",
            type: "route",
            route: "/publish",
            actions: {
                "authenticate": "publish-login",
                "continue": "publish-complete",
                "back": "publish-grid",
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
