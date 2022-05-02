import { NavTrack } from '../interfaces';

export const publishPostTrack: NavTrack = {
    name: "publishPostTrack",
    start: "publish-options",
    nodes: [
        {
            name: "return",
            type: "return",
            return: "edit",
            actions: {}
        },
        {
            name: "publish-options",
            type: "route",
            route: "/publish-options",
            actions: {
                "continue": "publish-preamble",
                "grid": "publish-grid",
                "nina": "nina-finder",
                "back": "return",
            }
        },
        {
            name: "publish-grid",
            type: "route",
            route: "/publish-grid",
            actions: {
                "continue": "publish-preamble",
                "image": "image",
                "back": "publish-options",
            }
        },
        {
            name: "nina-finder",
            type: "route",
            route: "/nina-finder",
            actions: {
                "back": "publish-options",
            }
        },
        {
            name: "image",
            type: "route",
            route: "/grid-image",
            actions: {
                "back": "publish-grid",
            }
        },
        {
            name: "publish-preamble",
            type: "route",
            route: "/publish-preamble",
            actions: {
                "preview": "publish-preview",
                "continue": "publish",
                "authenticate": "publish-login",
                "back": "publish-options",
            }
        },
        {
            name: "publish-login",
            type: "route",
            route: "/publish-login",
            actions: {
                "continue": "publish",
                "back": "publish-preamble",
            }
        },
        {
            name: "publish-preview",
            type: "route",
            route: "/publish-preview",
            actions: {
                "continue": "publish-preamble",
            }
        },
        {
            name: "publish",
            type: "route",
            route: "/publish",
            actions: {
                "authenticate": "publish-login",
                "continue": "publish-complete",
                "back": "publish-preamble",
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
