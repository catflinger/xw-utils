import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle or amending an existing puzzle
Edit refers to the role of a crossword editor, both a commissioner and a modifier of puzzles
*/

export const gridToolTrack: NavTrack = {
    name: "gridToolTrack",
    start: "start",
    nodes: [
        {
            name: "start",
            type: "route",
            route: "/grid-start",
            actions: {
                "continue": "edit",
                "cancel": "home",
            }
        },
        {
            name: "edit",
            type: "route",
            route: "/grid-editor",
            actions: {
                "continue": "publish",
                "nina": "nina-finder",
                "image": "image",
                "close": "home",
            }
        },
        {
            name: "nina-finder",
            type: "route",
            route: "/nina-finder",
            actions: {
                "back": "edit",
            }
        },
        {
            name: "image",
            type: "route",
            route: "/grid-image",
            actions: {
                "back": "edit",
            }
        },
        {
            name: "publish",
            type: "call",
            call: {
                track: "publishGridTrack",
            },
            actions: {
                "back": "edit",
            }
        },
        {
            name: "error",
            type: "route",
            route: "/nav-error",
            actions: {
                "continue": "home"
            }
        },
        {
            name: "home",
            type: "exit",
            actions: {}
        },
    ],
}
