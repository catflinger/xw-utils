import { ArchiveItem } from './archive-item';

export class ArchiveIndex {
    public readonly provider: string;
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