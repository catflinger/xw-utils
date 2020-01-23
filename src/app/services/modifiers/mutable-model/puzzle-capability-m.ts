import { IPuzzleCapability } from 'src/app/model/interfaces';

export abstract class PuzzleCapabilityM implements IPuzzleCapability {
    public abstract ready: boolean;
    public abstract blogable: boolean;
    public abstract solveable: boolean;
    public abstract gridable: boolean;
} 