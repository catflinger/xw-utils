import { Injectable } from '@angular/core';
import { Puzzle } from '../model/puzzle';
import { HttpClient } from '@angular/common/http';
import Quill, { DeltaOperation } from 'quill';
import Delta from "quill-delta";
import { PostContentGenerator } from './content-generator/content-generator';

@Injectable({
    providedIn: 'root'
})
export class PublicationService {

    constructor(private http: HttpClient) { }

    public publish(puzzle: Puzzle, username: string, password: string): Promise<any> {

        // TO DO: 
        // 4. Create am image of the grid
        // 5. Upload the gid image
        // 6. Update links to grid image in the post content

        let generator = new PostContentGenerator(puzzle);
        let content = generator.getContent();

        return this.http.post("http://localhost:49323/api/PublishPost", {
            provider: puzzle.info.provider,
            title: puzzle.info.title,
            content,
            username,
            password
        })
        .toPromise()
        .then((data) => {
            console.log(JSON.stringify(data));
        })
        .catch((error) => Promise.reject("failed to publish " + JSON.stringify(error)));
    }
}

function htmlFromQuillDelta(delta: Delta): string {
    const tempCont = document.createElement('div');
    const tempEditor: Quill = new Quill(tempCont);
    tempEditor.setContents(delta);
    return '' + tempEditor.root.innerHTML;
}