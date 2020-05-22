import { Injectable } from '@angular/core';
import { AppTrackData } from './tracks/app-track-data';
import { AppService } from '../../ui/general/app.service';
import { IActivePuzzle, IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';
import { ParseText } from 'src/app//modifiers/parsing-modifiers/parse-text';
import { RenumberGid } from 'src/app//modifiers/grid-modifiers/renumber-grid';
import { TextParsingService } from 'src/app/services/parsing/text/text-parsing-service';
import { ProviderService } from 'src/app/services/puzzles/provider.service';
import { CreateClues } from 'src/app/modifiers/clue-modifiers/create-clues';
import { InitAnnotationWarnings } from 'src/app/modifiers/puzzle-modifiers/init-annotation-warnings';
import { SetGridReferences } from 'src/app/modifiers/clue-modifiers/set-grid-references';
import { NavProcessor } from './interfaces';
import { UpdateInfo } from 'src/app/modifiers/puzzle-modifiers/update-info';

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

            case "editor-select":
                // TO DO: think if this test needs to be more sophisticated
                action = this.activePuzzle.puzzle.grid ?
                    Promise.resolve("solve") :
                    Promise.resolve("blog");
                    break;

            case "grid-captions":
                try {
                    this.activePuzzle.updateAndCommit(new RenumberGid());
                    action = Promise.resolve("ok");
                } catch (error) {
                    action = Promise.resolve("error");
                }
                break; 

            case "link":
                try {
                    this.activePuzzle.updateAndCommit(new SetGridReferences());
                    action = Promise.resolve("ok");
                } catch (error) {
                    action = Promise.resolve("error");
                }
                break;

            case "make-clues":
                // TO DO: work out what to do if puzzle aready has clues
                this.activePuzzle.updateAndCommit(new CreateClues(), new InitAnnotationWarnings());
                action = Promise.resolve("ok");
                break;

            case "parse":
                action = this.parse();
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

            case "set-grid-refs":
                this.activePuzzle.updateAndCommit(new SetGridReferences());
                action = Promise.resolve("ok");
                break;
    
            case "validate":
                action = this.validate();
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

        // TO DO: do some proper validation here...
        
        this.activePuzzle.updateAndCommit(new UpdateInfo({ ready: true }));
        return Promise.resolve("ok");
    }
}
