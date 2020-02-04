import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle or amending an existing puzzle

Edit refers to the role of a crossword editor, both a commissioner and a modifier of puzzles
*/

export const createArchiveTrack: NavTrack = {
    name: "createArchiveTrack",
    start: "open-puzzle",
    nodes: [
        {
            name: "open-puzzle",
            type: "route",
            route: "open-puzzle",
            actions: {
                "continue": "solve",
                "parse": "grid-captions",
                "error": "error",
            }
        },
        {
            name: "grid-captions",
            type: "process",
            process: "grid-captions",
            actions: {
                "ok": "parser",
                "error": "error",
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
                ok: "solver",
                error: "error"
            }
        },
        {
            name: "solver",
            type: "switch",
            switch: {
                track: "solveTrack"
            },
            actions: {}
        },
        {
            name: "abandon",
            type: "exit",
            actions: {}
        },
    ],
}
