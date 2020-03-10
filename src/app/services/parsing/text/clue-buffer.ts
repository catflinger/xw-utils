import { ClueGroup } from 'src/app/model/interfaces';
import { GridReference } from 'src/app/model/grid-reference';
import { Clue } from 'src/app/model/clue';
import { clueCaptionExpression, clueCaptionExpressionAdditionalPart } from './types';

export class ClueBuffer {
    private _rawText: string;
    private _direction: ClueGroup;
    private _caption: string;
    private _clue: string;
    private _letterCount: string;
    private _gridRefs: ReadonlyArray<GridReference>;

    constructor (text: string, direction: ClueGroup) {
        this._rawText = text.trim();
        this._direction = direction;

        // TO DO: check that the line has a valid caption
        this.updateAll();
    }

    public add(text: string) {
        this._rawText += " ";
        this._rawText += text.trim();
        this.updateAll();
    }
    public get rawText(): string{
        return this._rawText;
    }
    public get caption(): string{
        return this._caption;
    }
    public get clue(): string{
        return this._clue;
    }
    public get letterCount(): string{
        return this._letterCount;
    }
    public get gridRefs(): ReadonlyArray<GridReference>{
        return this._gridRefs;
    }

    private updateAll(): void {
        // TO DO: ...
        this.setCaption();
        this._letterCount = Clue.getLetterCount(this.rawText);
        if (this._caption) {
            this._gridRefs =  ClueBuffer.makeGridReferences(this._caption, this._direction);
        }
    }

    private setCaption(): void {

        if (!this._rawText || this._rawText.trim().length === 0) {
            this._caption = null;
        }
/*
        // one or two digits
        const firstPart = String.raw`^\s*\d{1,2}`;
        
        // optional space, a comma or slash, optional space, one or two digits, then an optioanl "across" or "down" or "/""
        const additionalPart = String.raw`\s*(,|/)\s*\d{1,2}(\s?(across|down|ac|dn))?`;
        
        // optional asterisk, optional space, (the first grid reference) then zero or more additional grid references
        const captionGroup = String.raw`(?<caption>\*?\s*${firstPart}(${additionalPart})*)`;
*/
        // any characters up to the end of the line
        const clueGroupExpression = String.raw`(?<clue>.*$)`;
        
        // start of line, optional space, (the caption group)
        const regExp = new RegExp(clueCaptionExpression + clueGroupExpression);

        const match = regExp.exec(this._rawText);

        if (match) {
            this._caption = match.groups.caption.trim();
            this._clue = match.groups.clue.trim();
        }

    }

    static makeGridReferences(caption: string, group: ClueGroup): ReadonlyArray<GridReference> {
        let result: GridReference[] = [];
        const expression = new RegExp(String.raw`\s*(?<clueNumber>\d{1,2})(\s?(?<direction>(across|down|ac|dn)))?`);
        //const expression = new RegExp(clueCaptionExpressionAdditionalPart);

        let parts = caption.split(",");

        parts.forEach((part) => {
            let clueNumber: number = 0;
            let clueGroup: ClueGroup = group;

            let match = expression.exec(part);

            if (match && match.groups.clueNumber) {
                clueNumber = parseInt(match.groups.clueNumber);
                if (match.groups.direction) {
                    clueGroup = <ClueGroup>match.groups.direction.toLowerCase(); 
                }
                result.push({ clueNumber, clueGroup });
            }
        });

        return result;
    }

}

