import { NavTrack } from '../interfaces';

export const editPuzzleTrack: NavTrack = {
    name: "editPuzzleTrack",
    start: "edit-grid",
    nodes: [
        {
            name: "edit-grid",
            type: "route",
            route: "/grid-editor",
            actions: {
                "continue": "grid-captions",
                "close": "abandon",
                "image": "image",
                "nina": "nina-finder",
            }
        },
        {
            name: "nina-finder",
            type: "route",
            route: "/nina-finder",
            actions: {
                "back": "edit-grid",
            }
        },
        {
            name: "image",
            type: "route",
            route: "/grid-image",
            actions: {
                "back": "edit-grid",
            }
        },
        {
            name: "grid-captions",
            type: "process",
            process: "grid-captions",
            actions: {
                "ok": "clues-editor",
                "error": "error",
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
            name: "solver",
            type: "switch",
            switch: {
                track: "solveTrack"
            },
            actions: {}
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
            name: "abandon",
            type: "exit",
            actions: {}
        },
    ],
}
