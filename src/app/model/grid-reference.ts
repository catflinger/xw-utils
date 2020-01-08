import { ClueGroup, IGridReference } from './interfaces';

export class GridReference implements IGridReference {
    // for example: 2 down or 23 across
    constructor(
        public readonly clueNumber: number,
        public readonly clueGroup: ClueGroup,
    ) {} 
}

