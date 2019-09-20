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

    // TO DO: IMPORTANT!
    // review this component for XSS vunerabilities


    public publishGrid(image: string, title: string, username: string, password: string): Promise<string> {
        if (image) {
            return this.http.post("http://localhost:49323/api/PublishGrid", {
                title: title,
                content: image,
                username,
                password
            })
            .toPromise()
            .then((data: any) => {
                let url: string = null;
                if (data.success) {
                    url = data.url;
                }
                return url;
            })
            .catch((error) => Promise.reject("failed to publish " + JSON.stringify(error)));
        } else {
            return Promise.resolve(null);
        }
    }

    public publishPost(puzzle: Puzzle, gridUrl: string, username: string, password: string): Promise<number> {

        let generator = new PostContentGenerator();
        let content = generator.getContent(puzzle, gridUrl);

        return this.http.post("http://localhost:49323/api/PublishPost", {
            provider: puzzle.info.provider,
            title: puzzle.info.title,
            content,
            username,
            password
        })
            .toPromise()
            .then((data: any) => {
                console.log(JSON.stringify(data));
                return data.wordpressId;
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