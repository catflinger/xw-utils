import { NavTrack } from '../interfaces';

export const openPuzzleTrack: NavTrack = {
    name: "open-puzzle",
    start: "open",
    nodes: [
        {
            name: "open",
            type: "route",
            route: "/open-puzzle",
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
                "solve": "solver",
                "blog": "blogger",
            }
        },
        {
            name: "exit",
            type: "exit",
            actions: {}
        }
    ],
}
