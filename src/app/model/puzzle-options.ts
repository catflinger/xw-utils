import { IPuzzleOptions } from './interfaces';

export class PuzzleOptions implements IPuzzleOptions {
    public readonly setGridRefsFromCaptions: boolean;

    constructor(data: any) {
        if (data) {
            this.setGridRefsFromCaptions = !! data.setGridRefsFromCaptions;
        } else {
            this.setGridRefsFromCaptions = true;
        }
    }
}