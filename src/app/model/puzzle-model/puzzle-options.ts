import { GridLinkMethod, IPuzzleOptions } from '../interfaces';

export class PuzzleOptions implements IPuzzleOptions {
    public readonly linkMethod: GridLinkMethod; // I think this is not used

    constructor(data: any) {
        if (data && typeof data.linkMethod === "string") {
            this.linkMethod = data.linkMethod;
        } else {
            this.linkMethod = "auto";
        }
    }
}