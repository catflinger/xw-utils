import { IDiary } from '../interfaces';
import { DiaryEntry } from './diary-entry';

export class Diary implements IDiary {
    readonly entries: ReadonlyArray<DiaryEntry> = [];

    constructor(data: any) {
        if (data && Array.isArray(data.entries)) {
            let entries: DiaryEntry[] = [];
            data.entries.forEach(d => entries.push(new DiaryEntry(d)));
            this.entries = entries;
        }
    }
}