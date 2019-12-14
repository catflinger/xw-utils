import { Injectable } from '@angular/core';
import { NavProcessor } from './interfaces';
import { AppTrackData } from './tracks/app-track-data';
import { AppService } from '../services/app.service';
import { HttpPuzzleSourceService } from 'src/app/services/http-puzzle-source.service';
import { ApiSymbols } from 'src/app/services/common';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { UpdateInfo } from 'src/app/services/modifiers/update-info';

@Injectable({
    providedIn: 'root'
})
export class UIProcessService implements NavProcessor<AppTrackData> {
    
    constructor(
        private appService: AppService,
        private puzzleSource: HttpPuzzleSourceService,
        private activePuzzle: IActivePuzzle,
    ) {}

    async exec(processName: string, appData: AppTrackData): Promise<string> {
        let action: string = null;

        switch (processName) {
            case "make-clues":
                action = this.makeClues();
                break;

            case "pdf-extract":
                action = await this.extractPdf();
                break;

            case "parse":
                action = this.parse();
                break;

            case "link":
                action = this.link();
                break;

            case "validate":
                action = this.validate();
                break;
    
            case "editor":
                action = this.editor();
                break;
        
            default:
                throw "Could not find navivgation process with name " + processName;
        }

        return action;
    }

    private makeClues(): string {
        return "ok";
    }

    private parse(): string {
        return "ok";
    }

    private link(): string {
        return "ok";
    }

    private validate(): string {
        return "ok";
    }

    private editor(): string {
        return "blogger";
    }

    private extractPdf(): Promise<string> {

        return this.puzzleSource.getPdfExtract(this.appService.openPuzzleParameters.sourceDataB64)
        .then((result) => {
            this.activePuzzle.update(new UpdateInfo({ source: result.text }));
            return "ok";
        })
        .catch((error) => {
            if (error === ApiSymbols.AuthorizationFailure) {
                return "authenticate";
            } else {
                throw error && error.message ? error.message : error.toString();
            }
        });
    }

}
