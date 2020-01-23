import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle or amending an existing puzzle

Edit refers to the role of a crossword editor, both a commissioner and a modifier of puzzles
*/

export const createTextTrack: NavTrack = {
    name: "createTextTrack",
    start: "special-text",
    nodes: [
        {
            name: "special-text",
            type: "route",
            route: "/special-text",
            actions: {
                "parse": "parser",
                "continue": "solve",
            }
        },
        {
            name: "error",
            type: "route",
            route: "/nav-error",
            actions: {
                "continue": "abandon"
            }
        },
        {
            name: "parser",
            type: "call",
            call: {
                track: "parseTrack"
            },
            actions: {
                "error": "special-text",
            }
        },
        {
            name: "abandon",
            type: "exit",
            actions: {}
        },
    ],
}
