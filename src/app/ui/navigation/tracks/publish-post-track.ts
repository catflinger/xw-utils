import { NavTrack } from '../interfaces';
import { EditorType } from '../nav.service';

export class PublishingTrackData {
    constructor(
        public editor: EditorType,
    ) {}
}

export const publishPostTrack: NavTrack = {
    name: "publish-post",
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
                "continue": "publish-options",
                "blog": "blogger",
            }
        },
        {
            name: "blogger",
            type: "route",
            route: "/blogger",
            actions: {
                "continue": "publish-options",
                "solve": "solver",
            }
        },
        {
            name: "publish-options",
            type: "route",
            route: "/publish-options",
            actions: {
                "continue": "publish-preamble",
                "grid": "publish-grid",
                "solve": "solver",
                "blog": "blogger",
            }
        },
        {
            name: "publish-grid",
            type: "route",
            route: "/publish-grid",
            actions: {
                "continue": "publish-preamble",
                "back": "publish-options",
            }
        },
        {
            name: "publish-preamble",
            type: "route",
            route: "/publish-preamble",
            actions: {
                "continue": "publish",
                "authenticate": "publish-login",
                "back": "publish-options",
            }
        },
        {
            name: "publish-login",
            type: "route",
            route: "/publish-login",
            actions: {
                "continue": "publish",
                "back": "publish-preamble",
            }
        },
        {
            name: "publish",
            type: "route",
            route: "/publish",
            actions: {
                "authenticate": "publish-login",
                "continue": "publish-complete",
                "back": "publish-preamble",
            }
        },
        {
            name: "publish-complete",
            type: "route",
            route: "/publish-complete",
            actions: {}
        },
    ],
}
