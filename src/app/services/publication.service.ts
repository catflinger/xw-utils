import { Injectable } from '@angular/core';
import { Puzzle } from '../model/puzzle';
import { HttpClient } from '@angular/common/http';
import { PostContentGenerator } from './content-generator/content-generator';
import { ApiResponse, ApiResponseStatus } from './common';
import { AuthService, Credentials } from './auth.service';

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

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    // TO DO: IMPORTANT!
    // review this component for XSS vunerabilities


    public publishGrid(image: string, title: string): Promise<PublishGridResponse> {
        const credentials: Credentials = this.authService.getCredentials();

        if (image) {
            return this.http.post("http://localhost:49323/api/PublishGrid", {
                title: title,
                content: image,
                username: credentials.username,
                password: credentials.password,
            })
            .toPromise()
            .then(data => data as PublishGridResponse)
        } else {
            return Promise.resolve(null);
        }
    }

    public publishPost(puzzle: Puzzle, gridUrl: string): Promise<PublishPostResponse> {
        const credentials: Credentials = this.authService.getCredentials();

        let generator = new PostContentGenerator();
        let content = generator.getContent(puzzle, gridUrl);

        return this.http.post("http://localhost:49323/api/PublishPost", {
            provider: puzzle.info.provider,
            title: puzzle.info.title,
            content,
            username: credentials.username,
            password: credentials.password,
    })
        .toPromise()
        .then(data => data as PublishPostResponse);
    }
}
