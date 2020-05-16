import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle or amending an existing puzzle
Edit refers to the role of a crossword editor, both a commissioner and a modifier of puzzles
*/

export const createPuzzleTrack: NavTrack = {
    name: "createPuzzleTrack",
    start: "start",
    nodes: [
        {
            name: "start",
            type: "route",
            route: "/create-puzzle",
            actions: {
                "continue": "hub",
            }
        },
        {
            name: "hub",
            type: "route",
            route: "/puzzle-hub",
            actions: {
                "add-grid": "grid-start",
                "edit-grid": "edit-grid",
                "add-clues": "make-clues",
                "edit-clues": "clues-editor",
                "add-text": "special-text",
                "solve": "solver",
            }
        },
        {
            name: "grid-start",
            type: "route",
            route: "/grid-start",
            actions: {
                "continue": "edit-grid",
                "cancel": "hub"
            }
        },
        {
            name: "edit-grid",
            type: "route",
            route: "/grid-editor",
            actions: {
                "continue": "link",
                "cancel": "hub",
            }
        },
        {
            name: "link",
            type: "process",
            process: "link",
            actions: {
                "ok": "hub",
                "error": "error",
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
                "ok": "hub",
            }
        },
        {
            name: "clues-editor",
            type: "route",
            route: "clues-editor",
            actions: {
                "continue": "link",
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
