import { NavTrack } from '../interfaces';

export const publishGridTrack: NavTrack = {
    name: "publishGridTrack",
    start: "publish",
    nodes: [
        {
            name: "publish-login",
            type: "route",
            route: "/publish-login",
            actions: {
                "continue": "publish",
                "back": "return",
            }
        },
        {
            name: "publish",
            type: "route",
            route: "/publish",
            actions: {
                "authenticate": "publish-login",
                "continue": "publish-complete",
                "back": "return",
            }
        },
        {
            name: "publish-complete",
            type: "route",
            route: "/publish-complete",
            actions: {}
        },
        {
            name: "return",
            type: "return",
            return: "back",
            actions: {}
        },

    ],
}
