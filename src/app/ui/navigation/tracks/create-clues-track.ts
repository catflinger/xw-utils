import { NavTrack } from '../interfaces';

export const createCluesTrack: NavTrack = {
    name: "create-clues",
    start: "parser",
    nodes: [
        {
            name: "parser",
            type: "route",
            route: "/special-text",
            actions: {
                "continue": "publish",
            }
        },
        {
            name: "publish",
            type: "call",
            call: {
                track: "publish-post",
                start: "blogger",
                data: { editor: "blogger"},
            },
            actions: {}
        },
    ],
}
