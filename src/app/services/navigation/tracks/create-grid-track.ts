import { NavTrack } from '../interfaces';

/*
This track is for creating a new puzzle or amending an existing puzzle

Edit refers to the role of a crossword editor, both a commissioner and a modifier of puzzles
*/

export const createGridTrack: NavTrack = {
    name: "createGridTrack",
    start: "grid-start",
    nodes: [
        {
            name: "grid-start",
            type: "route",
            route: "/grid-start",
            actions: {
                "continue": "edit-grid",
            }
        },
        {
            name: "edit-grid",
            type: "route",
            route: "/grid-editor",
            actions: {
                "continue": "publish",
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
            name: "publish",
            type: "switch",
            switch: {
                track: "publishGridTrack",
                start: "publish",
            },
            actions: {}
        },
    ],
}
