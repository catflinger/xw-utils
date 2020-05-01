import { PuzzleProvider, IPuzzleCapability } from '../../model3/interfaces';
import { PuzzleProvision } from './puzzle-provision';

export class PuzzleCapability implements IPuzzleCapability {
    public readonly blogable: boolean;
    public readonly solveable: boolean;
    public readonly gridable: boolean;
    public readonly ready: boolean;

    public readonly parsing: PuzzleProvision;

    constructor(data: any) {
        if (data) {
            this.ready = data.ready;
            this.blogable = data.blogable;
            this.solveable = data.solveable;
            this.gridable = data.gridable;
        }
    }
}
