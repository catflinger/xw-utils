import { NavTrack } from '../interfaces';

export const createGridCluesTrack: NavTrack = {
    name: "create-grid-clues",
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
                "continue": "parser",
                "authenticate": "publish-login",
            }
        },
        {
            name: "parser",
            type: "route",
            route: "/special-text",
            actions: {
                "solve": "solver",
                "blog": "blogger",
            }
        },
        {
            name: "solver",
            type: "route",
            route: "/solver",
            actions: {
                "continue": "publish",
                "blog": "blogger",
            }
        },
        {
            name: "blogger",
            type: "route",
            route: "/blogger",
            actions: {
                "continue": "publish",
                "solve": "solver",
            }
        },

        {
            name: "publish",
            type: "call",
            call: {
                track: "publish-post",
            },
            actions: {
                "solve": "solver",
                "blog": "blogger",
            }
        },
    ],
}
