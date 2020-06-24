import { ClueGroup, Direction } from 'src/app/model/interfaces';
import { GridReference } from 'src/app/model/puzzle-model/grid-reference';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { clueCaptionExpression } from './types';
import { Grid } from 'src/app/model/puzzle-model/grid';

export class ClueBuffer {
    private _rawText: string;
    private _direction: ClueGroup;
    private _caption: string;
    private _clue: string;
    private _letterCount: string;
    private _gridRefs: ReadonlyArray<GridReference>;

    constructor (text: string, direction: ClueGroup, private grid?: Grid) {
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
        }

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

    static makeGridReferences(clueCaption: string, group: ClueGroup, grid?: Grid): ReadonlyArray<GridReference> {

        let result: GridReference[] = [];
        const expression = new RegExp(String.raw`\s*\*?(?<caption>\d{1,2})\s*(?<direction>(across|down|ac|dn))?`);

        let parts = clueCaption.split(",");

        parts.forEach((part) => {
            let caption: number;

            let match = expression.exec(part);

            if (match && match.groups.caption) {
                caption = parseInt(match.groups.caption.toString());

                //determining direction:
                let ref: GridReference = null;

                if (match.groups.direction) {
                    
                    // 1. if there is an explicit direction give then use that
                    let directionString = match.groups.direction.toLowerCase();
                    let direction = directionString.charAt(0) === "a" ? "across" : "down";
                    ref = new GridReference({ 
                        caption, 
                        direction })
                
                } else {
                    if (grid) {

                        // 2. there is no explicit direction so first assume the reference direction is same as the clue group
                        ref = new GridReference({
                            caption, 
                            direction: group
                        });

                        let cells = grid.getGridEntryFromReference(ref);

                        if (cells.length < 2) {

                            // 3. if still no clue found so try in the other group
                            const otherGroup: ClueGroup = group === "across" ? "down" : "across";
                            ref = new GridReference({
                                caption, 
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
                            caption, 
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

