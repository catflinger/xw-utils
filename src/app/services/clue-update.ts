import { DefinitionKind } from '@angular/compiler/src/constant_pool';
import { Clue } from '../model/clue';

export class ClueUpdate {

    constructor(    
        public definition: string,
        public answer: string,
        public comment: string,
        ) { }
}