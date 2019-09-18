import { NgModule, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { QuillModule } from "ngx-quill";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './ui/app/app.component';
import { NavbarComponent } from './ui/components/navbar/navbar.component';
import { HomeComponent } from './ui/pages/home/home.component';
import { PublishOptionsComponent } from './ui/pages/publish-options/publish-options.component';
import { PublishComponent } from './ui/pages/publish/publish.component';
import { PublishCompleteComponent } from './ui/pages/publish-complete/publish-complete.component';
import { PublishPreambleComponent } from './ui/pages/publish-preamble/publish-preamble.component';
import { ClueListComponent } from './ui/components/clue-list/clue-list.component';
import { SolverComponent } from './ui/pages/solver/solver.component';
import { ClueEditorComponent } from './ui/components/clue-editor/clue-editor.component';
import { ClueTextChunkComponent } from './ui/components/clue-text-chunk/clue-text-chunk.component';
import { GridComponent } from './ui/components/grid/grid.component';

import { PuzzleManagementService, IPuzzleManager, IActivePuzzle } from './services/puzzle-management.service';
import { AlertComponent } from './ui/components/alert/alert.component';
import { TextStyleComponent } from './ui/components/text-style/text-style.component';
import { BloggerComponent } from './ui/pages/blogger/blogger.component';
import { ClueTextControlComponent } from './ui/components/clue-text-control/clue-text-control.component';
import { ClueTextComponent } from './ui/components/clue-text/clue-text.component';
import { CluesPreviewComponent } from './ui/components/clues-preview/clues-preview.component';
import { ContentPreviewComponent } from './ui/components/content-preview/content-preview.component';
import { HtmlAsIsPipe } from './ui/pipes/html-as-is.pipe';
import { ValidationMessageComponent } from './ui/components/validation-message/validation-message.component';

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
        HtmlAsIsPipe,
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
        CluesPreviewComponent,
        ContentPreviewComponent,
        ValidationMessageComponent,
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
        PuzzleManagementService,
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
