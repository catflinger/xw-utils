import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavTrack, NavTrackNode } from './interfaces';
import { publishingTrack } from "./tracks/publish-track";

//export type NavTrackName = "get-puzzle" | "solve" | "publish" | "create" | null;
//export type NavAction = "continue" | "back" | "cancel";
export type EditorType = "blogger" | "solver";

const tracks: ReadonlyArray<NavTrack> = [
    publishingTrack,
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
        this.clear();
    }

    public clear() {
        this.track = null;
        this.currentNode = null;
        this.appData = null;
    }
}


@Injectable({
    providedIn: 'root'
})
export class NavService {
    private _navContext: _NavContext = new _NavContext();

    constructor(private router: Router) { }

    public get navContext(): NavContext {
        return this._navContext;
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
        this._navContext.clear();
        let track = tracks.find(t => t.name === trackName);

        if (track) {
            const nodeName = startNodeName || track.start;
            let startNode = track.nodes.find(n => n.name === nodeName);

            if (startNode) {
                this._navContext.appData = data;
                this._navContext.track = track;
                this._navContext.currentNode = startNode;
                
                console.log("START NODE: " + JSON.stringify(startNode));

                this.router.navigate([startNode.route]);
            } else {
                throw "Navigation Error - could not find start node";
            }
        }
    }

    /*
    Go directly to the page named, abandon any current track.
    */
   public gotoRoute(route: string[]) {
        this._navContext.clear();
        this.router.navigate(route);
    }

    /*
    Go to the home page, abandon any current track.
    */
   public goHome() {
        this.gotoRoute(["/home"]);
    }

    /*
    Move to the next node on the track.
    */
    public goNext(action: string) {
                        
        console.log("CURRENT NODE: " + JSON.stringify(this._navContext.currentNode));

        if (this._navContext.currentNode) {
            let route = this._navContext.currentNode.actions[action];
            this.router.navigate([route]);
        }
    }
}
