import { Injectable } from '@angular/core';
import { Puzzle } from '../model/puzzle';
import { HttpClient } from '@angular/common/http';
import { PostContentGenerator } from './content-generator/content-generator';
import { ApiResponse, ApiResponseStatus } from './common';

abstract class PublishPostResponse implements ApiResponse {
    public abstract success: ApiResponseStatus;
    public abstract message: string;
    public abstract wordpressId: number;
}

abstract class PublishGridResponse implements ApiResponse {
    public abstract success: ApiResponseStatus;
    public abstract message: string;
    public abstract wordpressId: number;
    public abstract url: string;
}

@Injectable({
    providedIn: 'root'
})
export class PublicationService {

    constructor(private http: HttpClient) { }

    // TO DO: IMPORTANT!
    // review this component for XSS vunerabilities


    public publishGrid(image: string, title: string, username: string, password: string): Promise<PublishGridResponse> {
        if (image) {
            return this.http.post("http://localhost:49323/api/PublishGrid", {
                title: title,
                content: image,
                username,
                password
            })
            .toPromise()
            .then(data => data as PublishGridResponse)
        } else {
            return Promise.resolve(null);
        }
    }

    public publishPost(puzzle: Puzzle, gridUrl: string, username: string, password: string): Promise<PublishPostResponse> {

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
        .then(data => data as PublishPostResponse);
    }
}
