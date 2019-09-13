import { IPuzzleAnnotation } from 'src/app/model/interfaces';

export abstract class PuzzleAnnotationM implements IPuzzleAnnotation {
    public abstract header: string;
    public abstract body: string;
    public abstract footer: string;
}