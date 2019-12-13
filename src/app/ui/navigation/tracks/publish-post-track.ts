import { NavTrack } from '../interfaces';

export const publishPostTrack: NavTrack = {
    name: "publish-post",
    start: "publish-options",
    nodes: [
        {
            name: "exit-solver",
            type: "return",
            return: "solve",
            actions: {}
        },
        {
            name: "exit-blogger",
            type: "return",
            return: "blog",
            actions: {}
        },
        {
            name: "publish-options",
            type: "route",
            route: "/publish-options",
            actions: {
                "continue": "publish-preamble",
                "grid": "publish-grid",
                "solver": "exit-solver",
                "blogger": "exit-blogger",
            }
        },
        {
            name: "publish-grid",
            type: "route",
            route: "/publish-grid",
            actions: {
                "continue": "publish-preamble",
                "back": "publish-options",
            }
        },
        {
            name: "publish-preamble",
            type: "route",
            route: "/publish-preamble",
            actions: {
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
