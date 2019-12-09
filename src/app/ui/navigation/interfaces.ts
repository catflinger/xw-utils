export type NavNodeType = "route" | "transfer" | "enter" | "exit";


// Nav  actionis a map from teh actions names (object keys) to the target ndoe names (object values)
export type NavAction = { [key: string]: string }

// Note on NavTrackNode values:
//  type "route": value contains an Angular route
//  type "transfer" value contains the name of a track
//  type "enter" value contains the name of a track
//  type "exit" value contains the action to be returned

export interface NavTrackNode {
    name: string;
    type: NavNodeType;
    value: string; 
    actions: NavAction; 
}

export interface NavTrack {
    name: string;
    start: string;
    nodes: NavTrackNode[]; 
}

