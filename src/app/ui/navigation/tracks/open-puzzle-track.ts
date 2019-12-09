import { NavTrack } from '../interfaces';
import { EditorType } from '../nav.service';
import { AppTrackData } from './app-track-data';

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
