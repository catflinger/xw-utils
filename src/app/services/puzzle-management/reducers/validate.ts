import { IReducer } from './reducer';
import { IPuzzle } from 'src/app/model/interfaces';
import { TextChunk } from 'src/app/model/clue-text-chunk';
import { ClueValidationWarning } from 'src/app/model/interfaces';
import { PuzzleM } from './mutable-model/puzzle-m';

export class Validate implements IReducer {
    constructor() { }

    public exec(puzzle: PuzzleM) {
        puzzle.clues.forEach((clue) => {
            clue.warnings = this.validateClue(clue.answer, clue.comment, clue.chunks);
        });
    }

    private validateClue(answer: string, comment: string, chunks: readonly TextChunk[]): ClueValidationWarning[] {
        let warnings: ClueValidationWarning[] = [];

        if (!answer || answer.trim().length === 0) {
            warnings.push("missing answer");
        }

        let commentOK = false;

        if (comment && comment.length > 0) {
            let quill: any = JSON.parse(comment);
            if (quill.ops && Array.isArray(quill.ops)) {
                let text = "";

                quill.ops.forEach(op => {
                    if (op.insert) {
                        text += op.insert;
                    }
                });
                commentOK = text.trim().length > 0;
            }
        }

        if (!commentOK) {
            warnings.push("missing comment");
        }


        let definitionCount = 0;
        chunks.forEach(chunk => {
            if (chunk.isDefinition) {
                definitionCount++;
            }
        })

        if (definitionCount === 0) {
            warnings.push("missing definition");
        }

        return warnings;
    }

}