import { NavTrack } from '../interfaces';
import { AppTrackData } from './app-track-data';

export const createCluesTrack: NavTrack = {
    name: "create-clues",
    start: "parser",
    nodes: [
        {
            name: "parser",
            type: "route",
            route: "/special-text",
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
            }
        },
        {
            name: "blogger",
            type: "route",
            route: "/blogger",
            actions: {
                "continue": "publish",
                "solve": "solver",
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
    ],
}
