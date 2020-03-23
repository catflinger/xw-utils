import { IPuzzleOptions } from 'src/app/model/interfaces';

export abstract class PuzzleOptionsM implements IPuzzleOptions {
    public abstract setGridRefsFromCaptions: boolean;
}