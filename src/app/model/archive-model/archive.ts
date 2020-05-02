import { ArchiveIndex } from './archive-index';
import { PuzzleProvider } from '../interfaces';

export class Archive {
    public readonly indexes: ReadonlyArray<ArchiveIndex>;

    constructor(data: any) {
        let indexes = [];
        if (data && Array.isArray(data.indexes)) {
            data.indexes.forEach(index => indexes.push(new ArchiveIndex(index)));
        }
        this.indexes = indexes;
    }

    getIndex(provider: PuzzleProvider): ArchiveIndex {
        return this.indexes.find(index => index.provider === provider);
    }
}