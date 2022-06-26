import { Injectable, InjectionToken, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavTrack, NavTrackNode, NavContext, NavProcessor } from './interfaces';
import { from } from 'rxjs';
import { defaultIfEmpty, map, reduce } from 'rxjs/operators';

class _NavContext implements NavContext {
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
    private callStack: _NavContext[] = [];
    private _appData: T;

    constructor(
        private router: Router,
        private activatedRote: ActivatedRoute,
        @Inject(NAV_TRACKS) private tracks: ReadonlyArray<NavTrack>,
        @Inject(NAV_PROCESSOR) private processor: NavProcessor<T>
        ) { 
        }

    public get appData(): T {
        return this._appData;
    }

    /*
    Start a new track, if we have a current track then abandon it
    */
   public beginTrack(track: string, data: T, start?: string) {
        this._appData = data;
        this.callStack = [];

        this.callTrack(track, start);
    }

    /*
    Move to the next node on the track.
    */
    public async navigate(action: string): Promise<void> {
        let result = Promise.resolve();

        if (!this.callStack) {
            this.callStack = this.getCallStack();
        }

        try {
            if (this.callStack.length > 0) {
                let context = this.callStack[this.callStack.length - 1];
    
                if(context.currentNode) {
                    if (Object.keys(context.currentNode.actions).length === 0) {
                        // there are no actions specified, finish here
                        this.goHome();
    
                    } else {
                        let nextNodeName = context.currentNode.actions[action];
                        let nextNode = this.getTrackNode(context.track, nextNodeName);
        
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
            result = Promise.reject();
        }

        return result;
    }

    /*
    Go directly to the page named, abandon any current track.
    */
   public gotoRoute(route: string[]) {
        this.callStack = [];
        this._navigate(route);
    }

    /*
    Go to the home page, abandon any current track.
    */
    public goHome() {
        this.gotoRoute(["/home"]);
    }

    private async invokeNode(node: NavTrackNode, context: _NavContext): Promise<void> {
        let result = Promise.resolve();
        let action: string;

        switch (node.type) {
            case "route":
                context.currentNode = node;
                this._navigate([node.route]);
                break;
            case "switch":
                context.currentNode = node;
                this.switchTrack(node.switch.track, node.switch.start);
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

    private switchTrack(trackName: string, start: string) {
            let track = this.getTrack(trackName);

            if (track) {
                const nodeName = start || track.start;
                let startNode = this.getTrackNode(track, nodeName);

                if (startNode) {
                    let context = new _NavContext();
                    context.track = track;
                    context.currentNode = startNode;
                    this.callStack.pop();
                    this.callStack.push(context);
                    this.invokeNode(startNode, context);
                } else {
                    throw "Navigation Error - could not find start node";
                }
            } else {
                    throw "Navigation Error - could not find track with name " + trackName;
            }
    }

    private callTrack(trackName: string, start: string) {

        let track = this.getTrack(trackName);

        if (track) {
            const nodeName = start || track.start;
            let startNode = this.getTrackNode(track, nodeName);

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

    private _navigate(route: string[]) {

        from(this.callStack).pipe(
            map(frame => `${frame.track.name}.${frame.currentNode.name}`),
            reduce((queryStr, value) => `${queryStr}~${value}`),
            defaultIfEmpty(null)
        )
        .subscribe(queryString => {
            this.callStack = null;
            
            if (queryString) {
                this.router.navigate(route, { queryParams: { nav: queryString}});
            } else {
                this.router.navigate(route);
            }
        });
    }

    private getCallStack(): _NavContext[] {
        let result: _NavContext[] = [];

        let navParam = this.activatedRote.snapshot.queryParamMap.get('nav');

        if (navParam) {
            let frames = navParam.split("~");
            frames.forEach(frame => {
                if (frame) {
                    let parts = frame.split(".");
                    if (parts.length === 2) {
                        let track = this.getTrack(parts[0]);
                        let currentNode = this.getTrackNode(track, parts[1]);
                        result.push({track, currentNode});
                    }
                }
            })
        }

        return result;
    }

    private getTrack(name: string): NavTrack {
        return this.tracks.find(t => t.name === name);
    }

    private getTrackNode(track: NavTrack, name: string): NavTrackNode {
        return track.nodes.find(n => n.name === name);

    }

}
