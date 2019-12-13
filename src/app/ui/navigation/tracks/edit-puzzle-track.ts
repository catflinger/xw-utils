import { NavTrack } from '../interfaces';

/*
This track is for amending the clues and grid of an existing puzzle
*/

export const createGridCluesTrack: NavTrack = {
    name: "edit-puzzle",
    start: "grid",
    nodes: [
        {
            name: "grid",
            type: "route",
            route: "/grid-editor",
            actions: {
                "continue": "clues",
                "authenticate": "publish-login",
            }
        },
        {
            name: "clues",
            type: "route",
            route: "/clues-editor",
            actions: {
                "back": "grid",
                "solve": "solver",
                "blog": "blogger",
            }
        },
        {
            name: "validate",
            type: "route",
            route: "/puzzle-validation",
            actions: {
                "grid": "grid",
                "clues": "clues",
                "solve": "solver",
            }
        },
        {
            name: "solver",
            type: "call",
            call: { 
                track: "open-puzzle",
                start: "solve",
            },
            actions: {
            }
        },
        {
            name: "blogger",
            type: "call",
            call: { 
                track: "open-puzzle",
                start: "blog",
            },
            actions: {
            }
        },
    ],
}
