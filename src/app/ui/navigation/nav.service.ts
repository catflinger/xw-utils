import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavTrack, NavTrackNode, NavContext, NavProcessor } from './interfaces';

class _NavContext<T> implements NavContext {
    public track: NavTrack;
    public currentNode: NavTrackNode;

    constructor() {
        this.track = null;
        this.currentNode = null;
    }
}

export const NAV_TRACKS = new InjectionToken<ReadonlyArray<NavTrack>>("Navigation Tracks");
export const NAV_PROCESSOR = new InjectionToken<NavProcessor<any>>("Navigation Processes");

@Injectable({
    providedIn: 'root'
})
export class NavService<T> {
    private callStack: _NavContext<T>[] = [];
    private _appData: T;

    constructor(
        private router: Router,
        @Inject(NAV_TRACKS) private tracks: ReadonlyArray<NavTrack>,
        @Inject(NAV_PROCESSOR) private processor: NavProcessor<T>
        ) { }

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
   public beginTrack(track: string, data: T, start?: string) {
        this._appData = data;

        while(this.callStack.length > 0) {
            this.callStack.pop();
        }
        this.callTrack(track, start);
    }

    /*
    Move to the next node on the track.
    */
    public async navigate(action: string): Promise<void> {
        let result = Promise.resolve();

        //console.log("NAVIGATE " + action);

        if (this.callStack.length > 0) {
            let context = this.callStack[this.callStack.length - 1];

            if(context.currentNode) {
                let nextNodeName = context.currentNode.actions[action];
                let nextNode = context.track.nodes.find(n => n.name === nextNodeName);

                if (nextNode) {
                    result = this.invokeNode(nextNode, context);
                } else {
                    result = Promise.reject(`Cannot find a node ${nextNodeName} for the action ${action}`);
                }
            }
        } else {
            // we have no graph to work with, bail out
            this.goHome();
        }

        return result;
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

public async invokeNode(node: NavTrackNode, context: _NavContext<T>): Promise<void> {
    let result = Promise.resolve();
    let action: string;

    //console.log("INVOKING " + node.name);

    switch (node.type) {
        case "route":
            context.currentNode = node;
            this.router.navigate([node.route]);
            break;
        case "call":
            context.currentNode = node;
            this.callTrack(node.call.track, node.call.start);
            break;
        case "return":
            action = node.return;
            this.callStack.pop();
            result = this.navigate(action);
            break;
        case "process":
            action = await this.processor.exec(node.process, this._appData);
            context.currentNode = node;
            result = this.navigate(action);
            break;
        case "exit":
            this.goHome();
            break;
    }
    return result;
}

    private callTrack(trackName: string, start: string) {

        let track = this.tracks.find(t => t.name === trackName);

        if (track) {
            const nodeName = start || track.start;
            let startNode = track.nodes.find(n => n.name === nodeName);

            if (startNode) {
                let context = new _NavContext();
                context.track = track;
                context.currentNode = startNode;
                this.callStack.push(context);
                this.invokeNode(startNode, context);
            } else {
                throw "Navigation Error - could not find start node";
            }
        } else {
            throw "Navigation Error - could not find track with name " + trackName;
        }
}

}
