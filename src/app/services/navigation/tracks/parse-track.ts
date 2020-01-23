import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle or amending an existing puzzle

Edit refers to the role of a crossword editor, both a commissioner and a modifier of puzzles
*/

export const parseTrack: NavTrack = {
    name: "parseTrack",
    start: "parser",
    nodes: [
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
            name: "linker",
            type: "process",
            process: "link",
            actions: {
                "ok": "validator",
                "error": "link-error",
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
                "ok": "finish",
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
            name: "error",
            type: "return",
            return: "error",
            actions: {}
        },
        {
            name: "finish",
            type: "return",
            return: "ok",
            actions: {}
        },
        {
            name: "abandon",
            type: "exit",
            actions: {}
        },
    ],
}
