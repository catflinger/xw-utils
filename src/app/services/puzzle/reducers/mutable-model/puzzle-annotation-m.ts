import { IPuzzleAnnotation } from 'src/app/model/interfaces';

export class PuzzleAnnotationM implements IPuzzleAnnotation {
    header: string;
    body: string;
    footer: string;
}