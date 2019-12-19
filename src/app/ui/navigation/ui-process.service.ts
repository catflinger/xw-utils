import { Injectable } from '@angular/core';
import { NavProcessor } from './interfaces';
import { AppTrackData } from './tracks/app-track-data';
import { AppService } from '../services/app.service';
import { IActivePuzzle, IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { ParseData } from 'src/app/services/parsing/text/parse-data';
import { TextParsingService, TextParsingOptions } from 'src/app/services/parsing/text/text-parsing-service';
import { AddClues } from 'src/app/services/modifiers/add-clues';
import { LinkCluesToGrid } from 'src/app/services/modifiers/link-clues-to-grid';

@Injectable({
    providedIn: 'root'
})
export class UIProcessService implements NavProcessor<AppTrackData> {
    
    constructor(
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private puzzleManager: IPuzzleManager,
        private textParsingService: TextParsingService,
    ) {}

    async exec(processName: string, appData: AppTrackData): Promise<string> {
        let action: Promise<string>;

        switch (processName) {
            case "make-clues":
                action = Promise.resolve("ok");
                break;

            case "pdf-extract":
                action = this.puzzleManager.loadPuzzleFromPdf(this.appService.openPuzzleParameters.sourceDataB64);
                break; 

            case "parse":
                action = this.parse();
                break;

            case "link":
                try {
                    this.activePuzzle.update(new LinkCluesToGrid());
                    action = Promise.resolve("ok");
                } catch (error) {
                    action = Promise.resolve("error");
                }
                break;

            case "validate":
                action = this.validate();
                break;

            case "editor":
                action = this.activePuzzle.puzzle.grid ?
                    Promise.resolve("solve") :
                    Promise.resolve("blog");
                    break;

            default:
                action = Promise.reject("Could not find navivgation process with name " + processName);
        }

        return action;
    }

    // TO DO: move this to an UPDATE modifier
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

    private validate(): Promise<string> {
        return Promise.resolve("ok");
    }
}
