import { OnInit, Output, EventEmitter, Component, Input, OnDestroy } from '@angular/core';
import { AppStatus, AppService } from '../../services/app.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridStyles } from 'src/app/model/interfaces';
import { GridProperties } from 'src/app/model/grid-properties';

export class GridPropertiesArgs {
    constructor(
        public readonly title: string,
        public readonly properties: GridProperties,
    ) {} 
};

@Component({
  selector: 'app-grid-properties-editor',
  templateUrl: './grid-properties-editor.component.html',
  styleUrls: ['./grid-properties-editor.component.css']
})
export class GridPropertiesEditorComponent implements OnInit, OnDestroy {
    public readonly minCellsAcross = 1;
    public readonly minCellsDown = 1;
    public readonly maxCellsAcross = 25;
    public readonly maxCellsDown = 25;   
    public appStatus: AppStatus;
    public form: FormGroup;

    private subs: Subscription[] = [];

    @Input() public data: GridPropertiesArgs;
    @Output() public close:EventEmitter<GridPropertiesArgs> = new EventEmitter();

    constructor(
        private appService: AppService,
        private formBuilder: FormBuilder,
    ) { }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            title: [
                this.data ? this.data.title : "", 
                [Validators.required]],
            
            gridStyle: [
                this.data ? this.data.properties.style : GridStyles.standard, 
                [Validators.required]],

            cellsAcross: [
                this.data ? this.data.properties.size.across : 15, 
                [Validators.required, Validators.max(this.maxCellsAcross), Validators.min(this.minCellsAcross)]],

            cellsDown: [
                this.data ? this.data.properties.size.down : 15, 
                [Validators.required, Validators.max(this.maxCellsDown), Validators.min(this.minCellsDown)]],

            symmetrical : [
                this.data ? this.data.properties.symmetrical : true,
                [Validators.required],
            ]
        });

        this.subs.push(this.appService.getObservable().subscribe(s => this.appStatus = s));
        this.appService.clearAlerts();
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onContinue() {
        this.close.emit({
            title: this.form.value.title,
            properties: {
                style: this.form.value.gridStyle,
                size: {
                    across: this.form.value.cellsAcross,
                    down: this.form.value.cellsDown,
                },
                symmetrical: this.form.value.symmetrical,
            }
        });
    }

    public onCancel() {
        this.close.emit(null);
    }


}
