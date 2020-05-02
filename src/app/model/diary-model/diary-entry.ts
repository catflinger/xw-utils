import { IDiaryEntry } from '../interfaces';
import { DateTime } from 'luxon';

export class DiaryEntry implements IDiaryEntry {
    readonly solver: string;
    readonly provider: string;
    readonly solveDate: DateTime;
    readonly postDate: DateTime;
    readonly solve: boolean;

    constructor (data: any) {
        if (data) {
            this.solver = data.solver;
            this.provider = data.provider;

            if (typeof data.solve === "boolean") {
                this.solve = data.solve;
            }

            if (typeof data.postDate === "string") {
                try {
                    this.postDate = DateTime.fromISO(data.postDate);
                } catch {
                    this.postDate = null;
                }
            }

            if (typeof data.solveDate === "string") {
                try {
                    this.solveDate = DateTime.fromISO(data.solveDate);
                } catch {
                    this.solveDate = null;
                }
            }
        }

    }
}