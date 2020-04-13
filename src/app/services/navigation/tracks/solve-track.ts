import { NavTrack } from '../interfaces';

export const solveTrack: NavTrack = {
    name: "solveTrack",
    start: "editor",
    nodes: [
        {
            name: "editor",
            type: "process",
            process: "editor-select",
            actions: {
                "solve": "solver",
                "blog": "blogger",
            }
        },
        {
            name: "solver",
            type: "route",
            route: "/solver",
            actions: {
                "continue": "publish",
                "blog": "blogger",
                "back": "exit",
                "edit": "edit-puzzle",
            }
        },
        {
            name: "blogger",
            type: "route",
            route: "/blogger",
            actions: {
                "continue": "publish",
                "solve": "solver",
                "edit": "edit-puzzle",
                "back": "exit",
            }
        },
        {
            name: "publish",
            type: "switch",
            switch: {
                track: "publishPostTrack",
            },
            actions: {
                "edit": "editor",
            }
        },
        {
            name: "edit-puzzle",
            type: "call",
            call: {
                track: "editPuzzleTrack",
                start: "clues-editor",
            },
            actions: {}
        },
        {
            name: "exit",
            type: "exit",
            actions: {}
        }
    ],
}
