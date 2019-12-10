import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavTrack, NavTrackNode, NavContext } from './interfaces';

class _NavContext implements NavContext {
    public track: NavTrack;
    public currentNode: NavTrackNode;

    constructor() {
        this.track = null;
        this.currentNode = null;
    }
}

export const NAV_TRACKS = new InjectionToken<ReadonlyArray<NavTrack>>("Navigation Trakcs");

@Injectable({
    providedIn: 'root'
})
export class NavService<T> {
    private callStack: _NavContext[] = [];
    private _appData: T;

    constructor(
        private router: Router,
        @Inject(NAV_TRACKS) private tracks: ReadonlyArray<NavTrack>) { }

    public get debugNavContext(): NavContext {
        return this.callStack.length > 0 ? this.callStack[this.callStack.length - 1] : null;
    }

    public get appData(): T {
        return this._appData;
    }

    /*
    Used as an entry check on each page to deal with the situation where the
    user has jumped into the middle of a track via he browser history or something
    */
    public validateRoute(): void {

    // TO DO: check that the route matched the navigation state
    }

    /*
    Start a new track, if we have a current track then abandon it
    */
   public beginTrack(track: string, start?: string, data?: T) {
        this._appData = data;

        while(this.callStack.length > 0) {
            this.callStack.pop();
        }
        this.call(track, start);
    }

    /*
    Move to the next node on the track.
    */
    public navigate(action: string) {
        //console.log("Action: " + action);

        if (this.callStack.length > 0) {
            let context = this.callStack[this.callStack.length - 1];

            if(context.currentNode) {
                //console.log("CurrentNode: " + context.currentNode.name);
                let nextNodeName = context.currentNode.actions[action];
                //console.log("NextNode: " + nextNodeName);
                let nextNode = context.track.nodes.find(n => n.name === nextNodeName);

                if (nextNode) {
                    //console.log("D: " + nextNode.name);
                    //console.log("E: " + nextNode.type);

                    switch (nextNode.type) {
                        case "route":
                            context.currentNode = nextNode;
                            this.router.navigate([nextNode.route]);
                            break;
                        case "call":
                            context.currentNode = nextNode;
                            this.call(nextNode.call.track, nextNode.call.start);
                            break;
                        case "return":
                            let action = nextNode.return;
                            this.callStack.pop();
                                this.navigate(action);
                            break;
                        case "exit":
                            this.goHome();
                            break;
                    }
                } else {
                    throw `Cannot find a node ${nextNodeName} for the action ${action}`;
                }
            }
        } else {
            // we have no graph to work with, bail out
            this.goHome();
        }
    }

    /*
    Go directly to the page named, abandon any current track.
    */
   public gotoRoute(route: string[]) {
        while(this.callStack.length > 0) {
            this.callStack.pop();
        }
        this.router.navigate(route);
    }

    /*
    Go to the home page, abandon any current track.
    */
    public goHome() {
        this.gotoRoute(["/home"]);
    }

    private call(trackName: string, start: string) {

        let track = this.tracks.find(t => t.name === trackName);

        if (track) {
            const nodeName = start || track.start;
            let startNode = track.nodes.find(n => n.name === nodeName);

            if (startNode) {
                let context = new _NavContext();
                context.track = track;
                context.currentNode = startNode;
                this.callStack.push(context);

                this.router.navigate([startNode.route]);
            } else {
                throw "Navigation Error - could not find start node";
            }
        } else {
            throw "Navigation Error - could not find track with name " + trackName;
        }
}

}
