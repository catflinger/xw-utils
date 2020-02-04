import { Injectable } from '@angular/core';
import { NavProcessor } from './interfaces';
import { AppTrackData } from './tracks/app-track-data';
import { AppService } from '../../ui/services/app.service';
import { IActivePuzzle, IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { LinkCluesToGrid } from 'src/app/services/modifiers/link-clues-to-grid';
import { ParseText } from 'src/app/services/modifiers/parse-text';
import { RenumberGid } from 'src/app/services/modifiers/renumber-grid';
import { TextParsingService } from 'src/app/services/parsing/text/text-parsing-service';
import { ProviderService } from 'src/app/services/provider.service';
import { CreateClues } from '../modifiers/create-clues';
import { InitAnnotationWarnings } from '../modifiers/init-annotation-warnings';

@Injectable({
    providedIn: 'root'
})
export class UIProcessService implements NavProcessor<AppTrackData> {
    
    constructor(
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private puzzleManager: IPuzzleManager,
        private textParsingService: TextParsingService,
        private providerService: ProviderService,
    ) {}

    async exec(processName: string, appData: AppTrackData): Promise<string> {
        let action: Promise<string>;

        switch (processName) {
            // case "new-puzzle":
            //     this.puzzleManager.newPuzzle(this.appService.openPuzzleParameters.provider);
            //     action = Promise.resolve("ok");
            //     break;

            case "make-clues":
                // TO DO: work out what to do if puzzle aready has clues
                this.activePuzzle.update(new CreateClues(), new InitAnnotationWarnings());
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
            this.activePuzzle.update(new ParseText(this.textParsingService, this.providerService));
            const errors = this.activePuzzle.puzzle.provision.parseErrors;

            if (errors && errors.length) {
                action = "error";
            } else {
                action = "ok";
            }
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
