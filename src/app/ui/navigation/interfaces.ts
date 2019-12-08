export type NavAction = { [key: string]: string }

export interface NavTrackNode {
    name: string;
    route: string;
    actions: NavAction; 
}

export interface NavTrack {
    name: string;
    start: string;
    nodes: NavTrackNode[]; 
}

