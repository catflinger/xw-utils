import { NavTrack } from '../interfaces';

export const createCluesTrack: NavTrack = {
    name: "create-clues",
    start: "parser",
    nodes: [
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
                "back": "parser",
            }
        },
        {
            name: "blogger",
            type: "route",
            route: "/blogger",
            actions: {
                "continue": "publish",
                "solve": "solver",
                "back": "parser"
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
