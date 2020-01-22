import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle or amending an existing puzzle

Edit refers to the role of a crossword editor, both a commissioner and a modifier of puzzles
*/

export const createPdfTrack: NavTrack = {
    name: "createPdfTrack",
    start: "special",
    nodes: [
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
            actions: {}
        },
        {
            name: "abandon",
            type: "exit",
            actions: {}
        },
    ],
}
