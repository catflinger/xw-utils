export type NavNodeType = "route" | "call" | "return" | "exit"; // | "exec";

// Nav  action is a map from the actions names (object keys) to the target ndoe names (object values)
export type NavAction = { [key: string]: string }

export type TrackCallParamters = { 
    track: string;
    start?: string;
 }

export interface NavTrackNode {
    name: string;
    type: NavNodeType;
    actions: NavAction;

    route?: string;
    call?: TrackCallParamters;
    return?: string;
}

export interface NavTrack {
    name: string;
    start: string;
    nodes: NavTrackNode[]; 
}

export interface NavContext {
    readonly track: NavTrack;
    readonly currentNode: NavTrackNode;
}

// export interface NavProcess<T = any> {
//     exec(appData: T): string;
// }


