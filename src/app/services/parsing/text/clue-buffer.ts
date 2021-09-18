import { ClueGroup, CaptionStyle, Direction } from 'src/app/model/interfaces';
import { GridReference } from 'src/app/model/puzzle-model/grid-reference';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { clueCaptionExpression } from './types';
import { Grid } from 'src/app/model/puzzle-model/grid';
import { TextParsingError } from 'src/app/model/puzzle-model/text-parsing-error';

export class ClueBuffer {
    private _rawText: string;
    private _direction: ClueGroup;
    private _caption: string;
    private _clue: string;
    private _letterCount: string;
    private _gridRefs: ReadonlyArray<GridReference>;

    constructor (
        private captionStyle: CaptionStyle,
        //caption: string | null,
        text: string, 
        direction: ClueGroup, 
        private grid?: Grid
    ) {
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
            this._gridRefs =  ClueBuffer.makeGridReferences(this._caption, this._direction, this.grid);
        }
    }

    private setCaption(): void {

        if (!this._rawText || this._rawText.trim().length === 0) {
            this._caption = null;
            this._clue = "";

        } else {

            if (this.captionStyle === "any") {
                this._caption = this._caption || "";
                this._clue = this._rawText.trim();

            } else {

                const exp = this.captionStyle === "alphabetical" ?
                    String.raw`^\s*(?<caption>[A-Z])\s+(?<clue>.*)` :
                    clueCaptionExpression + String.raw`(?<clue>.*$)`;

                    const match = new RegExp(exp)
                    .exec(this._rawText);

                    if (match && match.groups) {
                        this._caption = match.groups.caption ? match.groups.caption.trim() : null;
                        this._clue = match.groups.clue.trim();
                    } else {
                        throw new TextParsingError("Failed to find a caption in the clue text");
                    }
                }
            }
    }

    static makeGridReferences(clueCaption: string, group: ClueGroup, grid?: Grid): ReadonlyArray<GridReference> {

        let result: GridReference[] = [];
        const expression = new RegExp(String.raw`\s*\*?(?<caption>\d{1,2})\s*(?<direction>(across|down|ac|dn))?`);

        const separator = clueCaption.indexOf(",") < 0 ? "/" : ",";

        let parts = clueCaption.split(separator);

        parts.forEach((part) => {
            let anchor: number;

            let match = expression.exec(part);

            if (match && match.groups.caption) {
                anchor = parseInt(match.groups.caption.toString());

                //determining direction:
                let ref: GridReference = null;

                if (match.groups.direction) {
                    
                    // 1. if there is an explicit direction give then use that
                    let directionString = match.groups.direction.toLowerCase();
                    let direction = directionString.charAt(0) === "a" ? "across" : "down";
                    ref = new GridReference({ 
                        caption: anchor, 
                        direction })
                
                } else {
                    if (grid) {

                        // 2. there is no explicit direction so first assume the reference direction is same as the clue group
                        ref = new GridReference({
                            caption: anchor, 
                            direction: group
                        });

                        let cells = grid.getGridEntryFromReference(ref);

                        if (cells.length < 2) {

                            // 3. if still no clue found so try in the other group
                            const otherGroup: ClueGroup = group === "across" ? "down" : "across";
                            ref = new GridReference({
                                caption: anchor, 
                                direction: otherGroup
                            });
                            let cells = grid.getGridEntryFromReference(ref);
    
                            if (cells.length < 2) {

                                ref = null;
                                // we have a reference to a clue not in the grid
                                // TO DO: how to handle this?  Is it an error?
                            }
                        }
                    } else {
                        ref = new GridReference({
                            caption: anchor, 
                            direction: group
                        });
                    }
                }

                if (ref) {
                    result.push(ref);
                }
            }
        });

        return result;
    }

}

