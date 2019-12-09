import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavTrack, NavTrackNode } from './interfaces';
import { publishPostTrack } from "./tracks/publish-post-track";
import { publishGridTrack } from './tracks/publish-grid-track';
import { createGridTrack } from './tracks/create-grid-track';

//export type NavTrackName = "get-puzzle" | "solve" | "publish" | "create" | null;
//export type NavAction = "continue" | "back" | "cancel";
export type EditorType = "blogger" | "solver";

const tracks: ReadonlyArray<NavTrack> = [
    publishPostTrack,
    publishGridTrack,
    createGridTrack,
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
    private contextStack: _NavContext[] = [];

    constructor(private router: Router) { }

    public get navContext(): NavContext {
        return this.contextStack.length > 0 ? this.contextStack[this.contextStack.length - 1] : null;
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
   public beginTrack(trackName: string, data: any, startNodeName?: string) {
        while(this.contextStack.length > 0) {
            this.contextStack.pop();
        }

        let track = tracks.find(t => t.name === trackName);

        if (track) {
            const nodeName = startNodeName || track.start;
            let startNode = track.nodes.find(n => n.name === nodeName);

            if (startNode) {
                let context = new _NavContext();
                context.appData = data;
                context.track = track;
                context.currentNode = startNode;
                this.contextStack.push(context);

                this.router.navigate([startNode.value]);
            } else {
                throw "Navigation Error - could not find start node";
            }
        } else {
            throw "Navigation Error - could not find track with name " + trackName;
        }
}

    /*
    Move to the next node on the track.
    */
    public goNext(action: string) {

        if (this.contextStack.length > 0) {
            let context = this.contextStack[this.contextStack.length - 1];

            if(context.currentNode) {
                let nextNodeName = context.currentNode.actions[action];
                let nextNode = context.track.nodes.find(n => n.name === nextNodeName);
                
                // good to go, switch to new context and navigate
                context.currentNode = nextNode;
                this.router.navigate([nextNode.value]);
            }
        } 
    }

    /*
    Go directly to the page named, abandon any current track.
    */
   public gotoRoute(route: string[]) {
        while(this.contextStack.length > 0) {
            this.contextStack.pop();
        }
        this.router.navigate(route);
    }

    /*
    Go to the home page, abandon any current track.
    */
    public goHome() {
        this.gotoRoute(["/home"]);
    }
}
