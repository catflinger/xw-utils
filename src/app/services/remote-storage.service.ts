import { Injectable } from '@angular/core';
import { PuzzleInfo } from '../model/puzzle';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RemoteStorageService {

  constructor(private httpClient: HttpClient) { }

  public listPuzzles() : Promise<PuzzleInfo[]> {

    return this.httpClient.get("/api/puzzle")
    .toPromise()
    .then((response) => {
        let results: PuzzleInfo[] = [];

        let json = localStorage.getItem("xw-puzzle-index");
    
        if (json) {
            let data = JSON.parse(json);
    
            if (data.puzzles && Array.isArray(data.puzzles)) {
                data.forEach(info => {
                    results.push(new PuzzleInfo(info))
                });
            }
        }
    
        return results;
    
    });
}


}
