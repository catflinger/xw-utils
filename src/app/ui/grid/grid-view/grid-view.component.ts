import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Grid } from 'src/app/model/puzzle-model/grid';
import { GridControlOptions, GridParameters, GridParametersSmall, GridParametersLarge, fifteenSquaredBlack } from '../../common';
import { GridPainterService } from '../grid-painter.service';

type GridInput = { 
    text: string,
    style: { 
        display: string,
        top: string,
        left: string,
        height: string,
        width: string,
        border: string,
        color:string,
    }, 
}
const editBorderWidth = 2;

const gridInputDefaults: GridInput = { 
    text: "", 
    style: {
        display: "none",
        top: "0px",
        left: "0px",
        height: "50px",
        width: "50px",
        border: `${editBorderWidth}px gold solid`,
        color: "black",
    }
};

@Component({
    selector: 'app-grid-view',
    templateUrl: './grid-view.component.html',
    styleUrls: ['./grid-view.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridViewComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() options: GridControlOptions;
    @Input() caption: string = "";
    @Input() grid: Grid;

    @ViewChild('gridCanvas', { static: false }) canvas: ElementRef;

    public canvasHeight: number = 0;
    public canvasWidth: number = 0;
    public source: string = "";
    public err: any;
    public model: GridInput = gridInputDefaults;

    private gridParams: GridParameters = new GridParametersLarge();
    private viewInitiated = false;
    private subs: Subscription[] = [];

    constructor(
        private gridPainter: GridPainterService,
        private detRef: ChangeDetectorRef) {
    }

    public ngOnInit() {
        this.gridParams = this.options && this.options.size === "small" ?
            new GridParametersSmall() :
            new GridParametersLarge();


            if (this.grid) {
                    this.model.style.display = "none";

                    this.resizeCanvas();

                    // don't draw the grid until the native canvas has had a chance to resize
                    setTimeout(() => { 
                        this.drawGrid(this.caption); 
                        //this.detRef.detectChanges() 
                    }, 0);

                    this.detRef.detectChanges();
                }
    }

    private resizeCanvas() {
        if (this.grid) {
            const captionHeight = this.caption ? this.gridParams.cellSize + this.gridParams.gridPadding * 3 : 0;

            this.canvasWidth = this.gridParams.cellSize * this.grid.properties.size.across + this.gridParams.gridPadding * 2;
            this.canvasHeight = this.gridParams.cellSize * this.grid.properties.size.down + this.gridParams.gridPadding * 2 + captionHeight;
            }
    }

    public ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
    }

    public ngAfterViewInit() {
        this.viewInitiated = true;
        this.drawGrid(this.caption);
    }

    public ngOnChanges() {
        this.resizeCanvas();

        setTimeout(_ => {
            this.drawGrid(this.caption);
            this.detRef.detectChanges();
        },
        0)
    }


    public getDataUrl(encoding: string): string {
        const canvas: HTMLCanvasElement = this.canvas.nativeElement;
        const context = canvas.getContext('2d');
        let params = { ...this.gridParams };
            
        if (this.options && this.options.color) {
            params.gridColor = this.options.color;
        }

        this.gridPainter.drawGrid(context, this.grid, this.options, params, this.caption);

        return canvas.toDataURL(`image/${encoding}`);
    }


    private drawGrid(caption: string): void {
        if (this.grid && this.viewInitiated && this.canvas) {
            const canvasEl = <HTMLCanvasElement>this.canvas.nativeElement;
            const context = canvasEl.getContext('2d');

            let params = { ...this.gridParams };
            
            if (this.options && this.options.color) {
                params.gridColor = this.options.color;
            }

            this.gridPainter.drawGrid(context, this.grid, this.options, params, caption);
        }
    }

}
