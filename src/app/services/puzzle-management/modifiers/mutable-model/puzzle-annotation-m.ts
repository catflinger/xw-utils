import { IPuzzleAnnotation } from 'src/app/model/interfaces';
import { DeltaOperation } from 'quill';

export abstract class PuzzleAnnotationM implements IPuzzleAnnotation {
    public abstract header:  DeltaOperation[];
    public abstract body:  DeltaOperation[];
    public abstract footer:  DeltaOperation[];
}