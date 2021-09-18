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
import { SyncGridContent } from 'src/app/modifiers/grid-modifiers/sync-grid-content';
import { SetRedirects } from 'src/app/modifiers/clue-modifiers/set-redirects';
import { TraceService } from '../app/trace.service';
import { UpdateProvision } from 'src/app/modifiers/puzzle-modifiers/update-provision';
import { FactoryResetClues } from 'src/app/modifiers/clue-modifiers/factory-reset-clues';
import { UpdatePuzzleOptions } from 'src/app/modifiers/publish-options-modifiers/update-puzzle-options';

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
        private traceService: TraceService,
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
                this.activePuzzle.updateAndCommit(
                    new UpdateProvision({ captionStyle: "numbered"}),
                    new CreateClues(), 
                    new InitAnnotationWarnings()
                );
                action = Promise.resolve("ok");
            break;

            case "make-clues-manual":
                // TO DO: work out what to do if puzzle aready has clues
                this.activePuzzle.updateAndCommit(
                    new FactoryResetClues(),
                    new UpdateProvision({ captionStyle: "any" }),
                    new UpdatePuzzleOptions("manual")
                );
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

            case "set-redirects":
                this.activePuzzle.updateAndCommit(new SetRedirects());
                action = Promise.resolve("ok");
                break;

            case "mark-as-ready":
                action = this.markAsReady();
                break;

            default:
                action = Promise.reject("Could not find navivgation process with name " + processName);
        }

        return action;
    }

    private parse(): Promise<string> {
        let action = "error";

        try {
            this.activePuzzle.updateAndCommit(
                new ParseText(this.textParsingService, this.providerService, this.traceService),
                new SyncGridContent());
                
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

    private markAsReady(): Promise<string> {

        // TO DO: do some proper validation here...
        
        this.activePuzzle.updateAndCommit(new UpdateInfo({ ready: true }));
        return Promise.resolve("ok");
    }
}
