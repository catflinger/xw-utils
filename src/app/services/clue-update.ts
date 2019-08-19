import { DefinitionKind } from '@angular/compiler/src/constant_pool';
import { Clue } from '../model/puzzle';

export class ClueUpdate {
    public definition: string;
    public answer: string;
    public comment: string;
    public text: string;

    constructor(clue: Clue) {
        this.answer = clue.answer;
        this.comment = clue.comment;
        this.text = clue.text;
        this.definition = clue.definition;
    }
}