import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle or amending an existing puzzle
Edit refers to the role of a crossword editor, both a commissioner and a modifier of puzzles
*/

export const createGridAndTextTrack: NavTrack = {
    name: "createGridAndTextTrack",
    start: "grid-start",
    nodes: [
        {
            name: "grid-start",
            type: "route",
            route: "/grid-start",
            actions: {
                "continue": "edit-grid",
            }
        },
        {
            name: "edit-grid",
            type: "route",
            route: "/grid-editor",
            actions: {
                "continue": "clues-start",
            }
        },
        {
            name: "clues-start",
            type: "route",
            route: "/clues-start",
            actions: {
                "auto": "make-clues",
                "text": "special-text",
            }
        },
        {
            name: "make-clues",
            type: "process",
            process: "make-clues",
            actions: {
                "ok": "clues-editor",
            }
        },
        {
            name: "clues-editor",
            type: "route",
            route: "clues-editor",
            actions: {
                "continue": "solver",
            }
        },
        {
            name: "special-text",
            type: "route",
            route: "/special-text",
            actions: {
                "parse": "parser",
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
                "ok": "solver",
                "error": "special-text",
            }
        },
        {
            name: "solver",
            type: "call",
            call: {
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
