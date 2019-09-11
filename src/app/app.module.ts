import { NgModule, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { QuillModule } from "ngx-quill";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './ui/app/app.component';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { HomeComponent } from './ui/home/home.component';
import { PublishOptionsComponent } from './ui/publish-options/publish-options.component';
import { PublishComponent } from './ui/publish/publish.component';
import { PublishCompleteComponent } from './ui/publish-complete/publish-complete.component';
import { PublishPreambleComponent } from './ui/publish-preamble/publish-preamble.component';
import { ClueListComponent } from './ui/clue-list/clue-list.component';
import { SolverComponent } from './ui/solver/solver.component';
import { ClueEditorComponent } from './ui/clue-editor/clue-editor.component';
import { ClueTextChunkComponent } from './ui/clue-text-chunk/clue-text-chunk.component';
import { GridComponent } from './ui/grid/grid/grid.component';

import { PuzzleManagementService, IPuzzleManager, IActivePuzzle } from './services/puzzle-management.service';
import { AlertComponent } from './ui/alert/alert.component';
import { TextStyleComponent } from './ui/text-style/text-style.component';
import { BloggerComponent } from './ui/blogger/blogger.component';
import { ClueTextControlComponent } from './ui/clue-text-control/clue-text-control.component';
import { ClueTextComponent } from './ui/clue-text/clue-text.component';

const quillGlobalConfig = {
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            ['link', 'image']
        ]
    }
};

@NgModule({
    declarations: [
        AppComponent,
        GridComponent,
        ClueListComponent,
        SolverComponent,
        ClueEditorComponent,
        ClueTextControlComponent,
        ClueTextChunkComponent,
        NavbarComponent,
        HomeComponent,
        PublishOptionsComponent,
        PublishComponent,
        PublishCompleteComponent,
        PublishPreambleComponent,
        AlertComponent,
        TextStyleComponent,
        BloggerComponent,
        ClueTextComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        NgbModule,
        HttpClientModule,
        ReactiveFormsModule,
        QuillModule.forRoot(quillGlobalConfig),
    ],
    providers: [
        {provide: IPuzzleManager, useExisting: PuzzleManagementService},
        {provide: IActivePuzzle, useExisting: PuzzleManagementService},
        HttpClient
    ],
    entryComponents: [
        ClueEditorComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
