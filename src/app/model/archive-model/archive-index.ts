import { ArchiveItem } from './archive-item';
import { PuzzleProvider } from '../interfaces';

export class ArchiveIndex {
    public readonly provider: PuzzleProvider;
    public readonly items: ReadonlyArray<ArchiveItem>;

    constructor(data: any) {
        if (data) {
            this.provider = data.provider;
            let items = [];
            if (Array.isArray(data.items)) {
                data.items.forEach(item => items.push(new ArchiveItem(item)));
            }
            this.items = items;
        }
    }
}