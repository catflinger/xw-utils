import { NavTrack } from '../interfaces';

export const publishGridTrack: NavTrack = {
    name: "publish-grid",
    start: "publish-grid",
    nodes: [
        {
            name: "publish-grid",
            type: "route",
            value: "/publish-grid",
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
                "back": "publish-grid",
            }
        },
        {
            name: "publish",
            type: "route",
            value: "/publish",
            actions: {
                "authenticate": "publish-login",
                "continue": "publish-complete",
                "back": "publish-grid",
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
