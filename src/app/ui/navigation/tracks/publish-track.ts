import { NavTrack } from '../interfaces';
import { EditorType } from '../nav.service';

export class PublishingTrackData {
    constructor(
        public editor: EditorType,
    ) {}
}

export const publishingTrack: NavTrack = {
    name: "publish",
    start: "open",
    nodes: [
        {
            name: "open",
            route: "/open-puzzle",
            actions: {
                "solve": "solver",
                "blog": "blogger",
            }
        },
        {
            name: "solver",
            route: "/solver",
            actions: {
                "continue": "publish-options",
                "blog": "blogger",
            }
        },
        {
            name: "blogger",
            route: "/blogger",
            actions: {
                "continue": "publish-options",
                "solve": "solver",
            }
        },
        {
            name: "publish-options",
            route: "/publish-options",
            actions: {
                "continue": "publish-preamble",
                "grid": "publish-grid",
                "back": "publish-options",
            }
        },
        {
            name: "publish-grid",
            route: "/publish-grid",
            actions: {
                "continue": "publish-preamble",
                "back": "publish-options",
            }
        },
        {
            name: "publish-preamble",
            route: "/publish-preamble",
            actions: {
                "continue": "publish",
                "authenticate": "publish-login",
                "back": "publish-options",
            }
        },
        {
            name: "publish-login",
            route: "/publish-login",
            actions: {
                "continue": "publish",
                "back": "publish-preamble",
            }
        },
        {
            name: "publish",
            route: "/publish",
            actions: {
                "authenticate": "publish-login",
                "continue": "publish-complete",
                "back": "publish-preamble",
            }
        },
    ],
}
