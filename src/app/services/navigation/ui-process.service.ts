import { Injectable } from '@angular/core';
import { NavProcessor } from './interfaces';
import { AppTrackData } from './tracks/app-track-data';
import { AppService } from '../../ui/services/app.service';
import { IActivePuzzle, IPuzzleManager } from 'src/app/services/puzzle-management.service';
import { LinkCluesToGrid } from 'src/app//modifiers/clue-modifiers/link-clues-to-grid';
import { ParseText } from 'src/app//modifiers/parsing-modifiers/parse-text';
import { RenumberGid } from 'src/app//modifiers/grid-modifiers/renumber-grid';
import { TextParsingService } from 'src/app/services/parsing/text/text-parsing-service';
import { ProviderService } from 'src/app/services/provider.service';
import { CreateClues } from 'src/app/modifiers/clue-modifiers/create-clues';
import { InitAnnotationWarnings } from 'src/app/modifiers/puzzle-modifiers/init-annotation-warnings';
import { SetGridReferences } from 'src/app/modifiers/clue-modifiers/set-grid-references';

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

            case "make-clues":
                // TO DO: work out what to do if puzzle aready has clues
                this.activePuzzle.updateAndCommit(new CreateClues(), new InitAnnotationWarnings());
                action = Promise.resolve("ok");
                break;

            case "pdf-extract":
                try {
                    action = this.puzzleManager.loadPuzzleFromPdf(this.appService.openPuzzleParameters);
                } catch (error){
                    if (appData) {
                        appData.errorMessage = error.toString();
                    }
                    action = error;
                }
                break; 

            case "grid-captions":
                try {
                    this.activePuzzle.updateAndCommit(new RenumberGid());
                    action = Promise.resolve("ok");
                } catch (error) {
                    action = Promise.resolve("error");
                }
                break; 

            case "parse":
                action = this.parse();
                break;

            case "set-grid-refs":
                this.activePuzzle.updateAndCommit(new SetGridReferences());
                action = Promise.resolve("ok");
                break;
    
            case "link":
                try {
                    this.activePuzzle.updateAndCommit(new LinkCluesToGrid());
                    action = Promise.resolve("ok");
                } catch (error) {
                    action = Promise.resolve("error");
                }
                break;

            case "validate":
                action = this.validate();
                break;

            case "editor-select":
                // TO DO: think if this test needs to be more sophisticated
                action = this.activePuzzle.puzzle.grid ?
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
            this.activePuzzle.updateAndCommit(new ParseText(this.textParsingService, this.providerService));
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
