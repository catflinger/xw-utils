import { ClueGroup } from 'src/app/model/interfaces';
import { GridReference } from 'src/app/model/grid-reference';

export class ClueBuffer {
    private _rawText: string;
    private _direction: ClueGroup;
    private _caption: string;
    private _clue: string;
    private _letterCount: string;
    private _gridRefs: GridReference[];

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
        this.setLetterCount();
        this.setGridReferences();
    }

    private setCaption(): void {

        if (!this._rawText || this._rawText.trim().length === 0) {
            this._caption = null;
        }

        // one or two digits
        const firstPart = String.raw`\d{1,2}`;
        
        // optional space, a comma or slash, optional space, one or two digits, then an optioanl "across" or "down" or "/""
        const additionalPart = String.raw`\s*(,|/)\s*\d{1,2}(\s?(across)|(down))?`;
        
        // optional asterisk, optional space, (the first grid reference) then zero or more additional grid references
        const captionGroup = String.raw`(?<caption>\*?\s*${firstPart}(${additionalPart})*)`;
        
        // any characters up to the end of the line
        const clueGroup = String.raw`(?<clue>.*$)`;
        
        // start of line, optional space, (the caption group)
        const regExp = new RegExp(String.raw`^\s*${captionGroup}${clueGroup}`);
        const match = regExp.exec(this._rawText);

        this._caption = match.groups.caption.trim();
        this._clue = match.groups.clue.trim();
    }

    private setLetterCount(): void {
        let result = "";

        const expression = String.raw`^(?<clue>.*)(?<letterCount>\([0-9-words, ]+?\)\s*$)`;

        const regExp = new RegExp(expression);
        const match = regExp.exec(this._rawText);

        if (match && match.groups["letterCount"]) {
            result = match.groups["letterCount"].trim();
        }

        this._letterCount = result;
    }

    private setGridReferences(): void {
        let result: GridReference[] = [];
        const expression = new RegExp(String.raw`\s*(?<clueNumber>\d{1,2})(\s?(?<direction>(across)|(down)))?`);

        let parts = this.caption.split(",");

        parts.forEach((part) => {
            let clueNumber: number = 0;
            let clueGroup: ClueGroup = this._direction;

            let match = expression.exec(part);

            if (match.groups.clueNumber) {
                clueNumber = parseInt(match.groups.clueNumber);
                if (match.groups.direction) {
                    clueGroup = <ClueGroup>match.groups.direction.toLowerCase(); 
                }
                result.push({ clueNumber, clueGroup });
            }
        });

        this._gridRefs = result;
    }

}

