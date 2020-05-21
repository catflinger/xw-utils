import { Component, OnInit } from '@angular/core';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateInfo } from 'src/app//modifiers/puzzle-modifiers/update-info';

@Component({
    selector: 'app-create-puzzle',
    templateUrl: './create-puzzle.component.html',
    styleUrls: ['./create-puzzle.component.css']
})
export class CreatePuzzleComponent implements OnInit {
    public form: FormGroup;

    constructor(
        private navService: NavService<AppTrackData>,
        private puzzleManager: IPuzzleManager,
        private formBuilder: FormBuilder,

    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            title: ["", [Validators.required]],
        });
    }

    public onContinue() {
        this.puzzleManager.newPuzzle("text", [new UpdateInfo({
            title: this.form.value.title,
            provider: "local",
        })]);
        this.navService.navigate("continue");
    }

    public onCancel() {
        this.navService.goHome();
    }

}
