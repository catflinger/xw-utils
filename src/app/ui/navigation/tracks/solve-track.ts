import { NavTrack } from '../interfaces';

export const solveTrack: NavTrack = {
    name: "solve",
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
            }
        },
        {
            name: "blogger",
            type: "route",
            route: "/blogger",
            actions: {
                "continue": "publish",
                "solve": "solver",
                "edit": "edit-clues",
                "back": "exit",
            }
        },
        {
            name: "publish",
            type: "call",
            call: {
                track: "publish-post",
            },
            actions: {
                "edit": "editor",
            }
        },
        {
            name: "edit-clues",
            type: "call",
            call: {
                track: "create",
                start: "edit-clues"
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
