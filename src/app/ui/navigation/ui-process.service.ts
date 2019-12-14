import { Injectable } from '@angular/core';
import { NavProcessor } from './interfaces';
import { AppTrackData } from './tracks/app-track-data';
import { AppService } from '../services/app.service';
import { HttpPuzzleSourceService } from 'src/app/services/http-puzzle-source.service';
import { ApiSymbols, ApiResponseStatus } from 'src/app/services/common';
import { IActivePuzzle, IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { UpdateInfo } from 'src/app/services/modifiers/update-info';
import { AddGrid } from 'src/app/services/modifiers/add-grid';
import { ParseData } from 'src/app/services/parsing/text/parse-data';
import { TextParsingService, TextParsingOptions } from 'src/app/services/parsing/text/text-parsing-service';
import { AddClues } from 'src/app/services/modifiers/add-clues';
import { Grid } from 'src/app/model/grid';

@Injectable({
    providedIn: 'root'
})
export class UIProcessService implements NavProcessor<AppTrackData> {
    
    constructor(
        private appService: AppService,
        private puzzleSource: HttpPuzzleSourceService,
        private activePuzzle: IActivePuzzle,
        private puzzleManager: IPuzzleManager,
        private textParsingService: TextParsingService,
    ) {}

    async exec(processName: string, appData: AppTrackData): Promise<string> {
        let action: Promise<string>;

        switch (processName) {
            case "make-clues":
                action = this.makeClues();
                break;

            case "pdf-extract":
                action = this.extractPdf();
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
                action = Promise.reject("Could not find navivgation process with name " + processName);
        }

        return action;
    }

    private makeClues(): Promise<string> {
        return Promise.resolve("ok");
    }

    private parse(): Promise<string> {
        let action = "error";

        try {
            let parseData = new ParseData();
            parseData.clueDataType = "text";
            parseData.rawData = this.activePuzzle.puzzle.info.source;
    
            let options: TextParsingOptions = {
                allowPreamble: true,
                allowPostamble: true,
            }

            let parser = this.textParsingService.parser(parseData, options);
            let context = parser.next();
    
            while(!context.done) {
                context = parser.next();
            }

            if (!context.value.error) {
                this.activePuzzle.update(new AddClues({ clues: context.value.clues }));
                action = "ok";
            } else {
                this.appService.setAlert("danger", "Parsing Error :" + context.value.error.message);
            }
        } catch(error) {
            this.appService.setAlert("danger", "ERROR :" + error.message)
        }

        return Promise.resolve(action);
    }

    private link(): Promise<string> {
        return Promise.resolve("ok");
    }

    private validate(): Promise<string> {
        return Promise.resolve("ok");
    }

    private editor(): Promise<string> {
    
        // if (this.activePuzzle.puzzle.grid) {
        //     return Promise.resolve("solve");
        // }
        return Promise.resolve("blog");
    }

    private extractPdf(): Promise<string> {

        return this.puzzleSource.getPdfExtract(this.appService.openPuzzleParameters.sourceDataB64)
        .then((result) => {

            if (result.success === ApiResponseStatus.OK) {
                //console.log("EXTRACTED PDF - GRID" + JSON.stringify(result.grid))
                //console.log("EXTRACTED PDF - TEXT" + result.text)
                this.puzzleManager.newPuzzle();
                this.activePuzzle.update(new UpdateInfo({ source: result.text }));

                if (result.grid) {
                    let grid = new Grid(result.grid)
                    this.activePuzzle.update(new AddGrid({ grid }));
                }

                return "ok";
            } else {
                return "error";
            }

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
