import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavTrack, NavTrackNode, NavContext, NavProcessor } from './interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

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

    private _log: BehaviorSubject<string[]>;

    constructor(
        private router: Router,
        @Inject(NAV_TRACKS) private tracks: ReadonlyArray<NavTrack>,
        @Inject(NAV_PROCESSOR) private processor: NavProcessor<T>
        ) { 
            this._log = new BehaviorSubject<string[]>([]);
        }

    public observe(): Observable<ReadonlyArray<string>> {
        return this._log.asObservable();
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
        this.abandonAll();
        this._appData = data;

        this.log("BEGINNING TRACK " + track);
        this.callTrack(track, start);
    }

    /*
    Move to the next node on the track.
    */
    public async navigate(action: string): Promise<void> {
        let result = Promise.resolve();

        try {
            if (this.callStack.length > 0) {
                let context = this.callStack[this.callStack.length - 1];
    
                if(context.currentNode) {
                    if (Object.keys(context.currentNode.actions).length === 0) {
                        // there are no actions specified, finish here
                        this.goHome();
    
                    } else {
                        let nextNodeName = context.currentNode.actions[action];
                        let nextNode = context.track.nodes.find(n => n.name === nextNodeName);
        
                        if (nextNode) {
                            result = this.invokeNode(nextNode, context);
                        } else {
                            result = Promise.reject(`Cannot find a node ${nextNodeName} for the action ${action}`);
                        }
                    }
                } else {
                    // TO DO: what situation does this represent?
                    // is it always an error?
                }
            } else {
                // we have no more graphs to work with, bail out
                this.goHome();
            }
        } catch (error) {
            this.log("ERROR " + error.toString());
            result = Promise.reject();
        }

        return result;
    }

    /*
    Go directly to the page named, abandon any current track.
    */
   public gotoRoute(route: string[]) {
        this.abandonAll();
        this.router.navigate(route);
    }

    /*
    Go to the home page, abandon any current track.
    */
    public goHome() {
        this.abandonAll();
        this.gotoRoute(["/home"]);
    }

public async invokeNode(node: NavTrackNode, context: _NavContext<T>): Promise<void> {
    let result = Promise.resolve();
    let action: string;

    this.log("INVOKING " + node.name);

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

    private abandonAll() {
        try {
            while(this.callStack.length > 0) {
                this.callStack.pop();
            }
            this.clearLog();
        } catch {}
    }

    private log(msg: string): void {
        let current = this._log.value;
        current.push(msg);
        this._log.next(current);
    }

    private clearLog(): void {
        this._log.next([]);
    }

}
