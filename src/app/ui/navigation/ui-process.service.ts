import { Injectable } from '@angular/core';
import { NavProcessor } from './interfaces';
import { AppTrackData } from './tracks/app-track-data';
import { AppService } from '../services/app.service';
import { IActivePuzzle, IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { ParseData } from 'src/app/services/parsing/text/parse-data';
import { AddClues } from 'src/app/services/modifiers/add-clues';
import { LinkCluesToGrid } from 'src/app/services/modifiers/link-clues-to-grid';
import { ParseText } from 'src/app/services/modifiers/parse-text';
import { RenumberGid } from 'src/app/services/modifiers/renumber-grid';

@Injectable({
    providedIn: 'root'
})
export class UIProcessService implements NavProcessor<AppTrackData> {
    
    constructor(
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private puzzleManager: IPuzzleManager,
        private textParser: ParseText,
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

            case "grid-captions":
                try {
                    this.activePuzzle.update(new RenumberGid());
                    action = Promise.resolve("ok");
                } catch (error) {
                    action = Promise.resolve("error");
                }
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

            case "editor-select":
                action = this.activePuzzle.puzzle.linked ?
                    Promise.resolve("solve") :
                    Promise.resolve("blog");
                    break;

            default:
                action = Promise.reject("Could not find navivgation process with name " + processName);
        }

        return action;
    }

    private parse(): Promise<string> {
        let action = "error";

        try {
            this.activePuzzle.update(this.textParser);
            action = "ok";
        } catch(error) {
            action = "error";
            this.appService.setAlert("danger", "Parsing Error :" + error);
        }

        return Promise.resolve(action);
    }

    private validate(): Promise<string> {
        return Promise.resolve("ok");
    }
}
