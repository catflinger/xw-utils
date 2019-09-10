import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PuzzleInfo } from '../model/puzzle-info';
import { LocalStorageService } from './local-storage.service';
import { Puzzle } from '../model/puzzle';
import { HttpPuzzleSourceService } from './http-puzzle-source.service';
import { PuzzleService } from './puzzle.service';

@Injectable({
    providedIn: 'root'
})
export class PuzzleManagementService {
    private bsList: BehaviorSubject<PuzzleInfo[]>;

    constructor(
        private localStorageService: LocalStorageService,
        private httpPuzzleService: HttpPuzzleSourceService,
    ) {
        this.bsList = new BehaviorSubject<PuzzleInfo[]>([]);
        this.refreshPuzzleList();
    }

    public getListObservable(): Observable<PuzzleInfo[]> {
        return this.bsList.asObservable();
    }

    public getLatestPuzzle(): Promise<Puzzle> {
        return this.localStorageService.getLastest();
    }

    public getSavedPuzzle(id: string): Promise<Puzzle> {
        return this.localStorageService.getPuzzle(id)
            .then((puzzle) => {
                this.localStorageService.putPuzzle(puzzle);
                return puzzle;
            });
    }

    public deletePuzzle(id: string): Promise<void> {
        return this.localStorageService.deletePuzzle(id)
            .then(() => {
                this.refreshPuzzleList();
            });
    }

    public getNewPuzzle(providerName: string, options?: any): Promise<Puzzle> {
        return this.httpPuzzleService.getPuzzle(providerName)
            .then((puzzle) => {
                this.localStorageService.putPuzzle(puzzle);
                this.refreshPuzzleList();

                return puzzle;
            })
            .catch((error) => {
                console.log("Failed to get puzzle:" + error.toString());
                throw new Error("Failed to load puzzle from " + providerName);
            });
    }

    public savePuzzle(puzzle: Puzzle): void {
        this.localStorageService.putPuzzle(puzzle);
        this.refreshPuzzleList();
    }

    private refreshPuzzleList() {
        let list = this.localStorageService.listPuzzles();
        this.bsList.next(list);
    }

}
