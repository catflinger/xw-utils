import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle or amending an existing puzzle

Edit refers to the role of a crossword editor, both a comissioner and a modifier of puzzles
*/

export const puzzleEditTrack: NavTrack = {
    name: "puzzle-edit-track",
    start: "special",
    nodes: [
        {
            name: "special",
            type: "route",
            route: "/special",
            actions: {
                "pdf": "pdf-start",
                "grid": "grid-start",
                "clues": "special-text",
            }
        },
        {
            name: "pdf-start",
            type: "route",
            route: "/special-pdf",
            actions: {
                "continue": "pdf-extract",
            }
        },
        {
            name: "grid-start",
            type: "route",
            route: "/grid-start",
            actions: {
                "continue": "edit-grid-1",
            }
        },
        {
            name: "edit-grid-1",
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
            name: "special-text",
            type: "route",
            route: "/special-text",
            actions: {
                "continue": "parser",
            }
        },
        {
            name: "pdf-extract",
            type: "process",
            process: "pdf-extract",
            actions: {
                "ok": "parser",
                "authenticate": "login",
                "error": "error",
            }
        },
        {
            name: "login",
            type: "route",
            route: "/special-login",
            actions: {
                "ok": "pdf-extract",
                "cancel": "abandon",
                "back": "special-pdf",
            }
        },
        {
            name: "parser",
            type: "process",
            process: "parse",
            actions: {
                "ok": "linker",
                "error": "error",
            }
        },
        {
            name: "make-clues",
            type: "process",
            process: "make-clues",
            actions: {
                "ok": "linker",
            }
        },
        {
            name: "linker",
            type: "process",
            process: "link",
            actions: {
                "ok": "validator",
                "error": "clues-error",
            }
        },
        {
            name: "link-error",
            type: "route",
            route: "/link-error",
            actions: {
                "grid": "edit-grid-2",
                "clues": "edit-clues",
            }
        },
        {
            name: "validator",
            type: "process",
            process: "validate",
            actions: {
                "ok": "end",
                "error": "link-error",
            }
        },
        {
            name: "validation-error",
            type: "route",
            route: "/validate-puzzle",
            actions: {
                "grid": "edit-grid-2",
                "clues": "edit-clues",
            }
        },
        {
            name: "edit-grid",
            type: "route",
            route: "/grid-editor",
            actions: {
                "continue": "linker",
            }
        },
        {
            name: "edit-clues",
            type: "route",
            route: "/clues-editor",
            actions: {
                "continue": "linker",
            }
        },
        {
            name: "error",
            type: "route",
            route: "/nav-error",
            actions: {
                "continue": "end"
            }
        },
        {
            name: "end",
            type: "call",
            call: {
                track: "solve-track"
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
