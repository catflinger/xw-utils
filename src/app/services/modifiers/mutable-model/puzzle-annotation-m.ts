import { IPuzzleAnnotation, QuillDelta } from 'src/app/model/interfaces';

export abstract class PuzzleAnnotationM implements IPuzzleAnnotation {
    public abstract header:  QuillDelta;
    public abstract body:  QuillDelta;
    public abstract footer:  QuillDelta;
}