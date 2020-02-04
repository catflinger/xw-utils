import { NavTrack } from '../interfaces';

export const createTextTrack: NavTrack = {
    name: "createTextTrack",
    start: "special-text",
    nodes: [
        {
            name: "special-text",
            type: "route",
            route: "/special-text",
            actions: {
                "parse": "parser",
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
                "error": "special-text",
                "ok": "solve",
            }
        },
        {
            name: "solve",
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
