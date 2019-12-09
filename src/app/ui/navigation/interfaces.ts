export type NavNodeType = "route" | "call" | "return";


// Nav  actionis a map from teh actions names (object keys) to the target ndoe names (object values)
export type NavAction = { [key: string]: string }

export type TrackCallParamters = { 
    track: string;
    data: any;
    start?: string;
 }

// Note on NavTrackNode values:
//  type "route": value contains an Angular route
//  type "transfer" value contains the name of a track
//  type "enter" value contains the name of a track
//  type "exit" value contains the action to be returned

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

