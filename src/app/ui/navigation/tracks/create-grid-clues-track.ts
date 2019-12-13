import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle containing both a grid and text.
*/

export const createGridCluesTrack: NavTrack = {
    name: "create-grid-clues",
    start: "create",
    nodes: [
        {
            name: "create",
            type: "route",
            route: "/create-puzzle",
            actions: {
                "continue": "grid-start",
            }
        },
        {
            name: "grid-start",
            type: "route",
            route: "/grid-start",
            actions: {
                "continue": "grid",
            }
        },
        {
            name: "grid",
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
                "continue": "clues-editor",
            }
        },
        {
            name: "clues",
            type: "route",
            route: "/clues-editor",
            actions: {
                "back": "grid-editor",
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
