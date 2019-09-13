import { Injectable } from '@angular/core';
import { Puzzle } from '../model/puzzle';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PublicationService {

    constructor(private http: HttpClient) { }

    public publish(puzzle: Puzzle, username: string, password: string): Promise<void> {

     // TO DO: 
     // 1. create the HTML markup for the clues
     // 2. create the HTML markup for the comments
     // 3. Generate the HTML markup for the post content
     // 4. Create am image of the grid
     // 5. Upload the gid image
     // 6. Update links to grid image in the post content
     // 7. Upload the post content


        return this.http.post("http://localhost:49323/publishpuzzle", { puzzle, username, password })
        .toPromise()
        .then((data) => Promise.resolve())
        .catch((error) => Promise.reject("failed to publish " + JSON.stringify(error)));
    }
}
