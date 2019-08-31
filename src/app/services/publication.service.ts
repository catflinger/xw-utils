import { Injectable } from '@angular/core';
import { Puzzle } from '../model/puzzle';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PublicationService {

    constructor(private http: HttpClient) { }

    public publish(puzzle: Puzzle, username: string, password: string): Promise<void> {
        return this.http.post("http://localhost:49323/publishpuzzle", { puzzle, username, password })
        .toPromise()
        .then((data) => Promise.resolve())
        .catch((error) => Promise.reject("failed to publish " + JSON.stringify(error)));
    }
}
