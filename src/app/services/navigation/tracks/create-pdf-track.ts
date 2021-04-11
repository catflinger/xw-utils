import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle or amending an existing puzzle

Edit refers to the role of a crossword editor, both a commissioner and a modifier of puzzles
*/

export const createPdfTrack: NavTrack = {
    name: "createPdfTrack",
    start: "pdf-start",
    nodes: [
        {
            name: "open-puzzle",
            type: "route",
            route: "open-puzzle",
            actions: {
                "continue": "solver",
                "parse": "grid-captions",
                "error": "error",
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
            name: "pdf-extract",
            type: "process",
            process: "pdf-extract",
            actions: {
                "ok": "grid-captions",
                "authenticate": "login",
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
                error: "special-text",
            }
        },
        {
            name: "special-text",
            type: "route",
            route: "/special-text",
            actions: {
                "parse": "parser",
                "cancel": "abandon",
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
