import { Injectable } from '@angular/core';
import { PuzzleInfo } from '../model/puzzle-info';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RemoteStorageService {

  constructor(private httpClient: HttpClient) { }

  public listPuzzles() : Promise<PuzzleInfo[]> {

    return this.httpClient.get("/puzzleList")
    .toPromise()
    .then((data: any) => {
        let results: PuzzleInfo[] = [];

        if (data && data.puzzles && Array.isArray(data.puzzles)) {
            data.forEach(puzzle => {
                results.push(new PuzzleInfo(puzzle))
            });
        }
        return results;
    
    })
    .catch((error) => {
        console.log("ERROR getting puzzle list: " + error);
        throw error;
    });
}


}
