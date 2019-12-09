import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavTrack, NavTrackNode, TrackCallParamters } from './interfaces';
import { publishPostTrack } from "./tracks/publish-post-track";
import { publishGridTrack } from './tracks/publish-grid-track';
import { createGridTrack } from './tracks/create-grid-track';
import { createCluesTrack } from './tracks/create-clues-track';

//export type NavTrackName = "get-puzzle" | "solve" | "publish" | "create" | null;
//export type NavAction = "continue" | "back" | "cancel";
export type EditorType = "blogger" | "solver";

const tracks: ReadonlyArray<NavTrack> = [
    publishPostTrack,
    publishGridTrack,
    createGridTrack,
    createCluesTrack,
];

export interface NavContext {
    readonly track: NavTrack;
    readonly currentNode: NavTrackNode;
    appData: any;
}

class _NavContext implements NavContext {
    public track: NavTrack;
    public currentNode: NavTrackNode;
    public appData: any;

    constructor() {
        this.track = null;
        this.currentNode = null;
        this.appData = null;
    }
}

@Injectable({
    providedIn: 'root'
})
export class NavService {
    private callStack: _NavContext[] = [];

    constructor(private router: Router) { }

    public get navContext(): NavContext {
        return this.callStack.length > 0 ? this.callStack[this.callStack.length - 1] : null;
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
   public beginTrack(params: TrackCallParamters) {
        
        while(this.callStack.length > 0) {
            this.callStack.pop();
        }
        this.call(params);
    }

    /*
    Move to the next node on the track.
    */
    public goNext(action: string) {
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

                    switch (nextNode.type) {
                        case "route":
                            context.currentNode = nextNode;
                            this.router.navigate([nextNode.route]);
                            break;
                        case "call":
                            this.call(nextNode.call);
                            break;
                        case "return":
                            let action = nextNode.return;
                            this.callStack.pop();
                            this.goNext(action);
                            break;
                    }
                } else {
                    throw `Cannot find a node ${nextNodeName} for the action ${action}`;
                }
            }
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

    private call(params: TrackCallParamters) {

        let track = tracks.find(t => t.name === params.track);

        if (track) {
            const nodeName = params.start || track.start;
            let startNode = track.nodes.find(n => n.name === nodeName);

            if (startNode) {
                let context = new _NavContext();
                context.appData = params.data;
                context.track = track;
                context.currentNode = startNode;
                this.callStack.push(context);

                this.router.navigate([startNode.route]);
            } else {
                throw "Navigation Error - could not find start node";
            }
        } else {
            throw "Navigation Error - could not find track with name " + params.track;
        }
}

}
