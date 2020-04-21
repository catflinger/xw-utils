import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { QuillModule } from "ngx-quill";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './ui/app/app.component';
import { PublishOptionsComponent } from './ui/puzzle-publishing/publish-options/publish-options.component';
import { PublishComponent } from './ui/puzzle-publishing/publish/publish.component';
import { PublishCompleteComponent } from './ui/puzzle-publishing/publish-complete/publish-complete.component';
import { PublishPreambleComponent } from './ui/puzzle-publishing/publish-preamble/publish-preamble.component';
import { ClueListComponent } from './ui/components/clue-list/clue-list.component';
import { SolverComponent } from './ui/puzzle-solving/solver/solver.component';
import { ClueAnnotationComponent } from './ui/components/editor/forms/clue-annotator/clue-annotator.component';
import { ClueTextChunkComponent } from './ui/components/clue-text-chunk/clue-text-chunk.component';
import { GridComponent } from './ui/components/grid/grid.component';

import { PuzzleManagementService, IPuzzleManager, IActivePuzzle } from './services/puzzles/puzzle-management.service';
import { AlertComponent } from './ui/components/alert/alert.component';
import { TextStyleComponent } from './ui/components/text-style/text-style.component';
import { BloggerComponent } from './ui/puzzle-solving/blogger/blogger.component';
import { ClueTextControlComponent } from './ui/components/clue-text-control/clue-text-control.component';
import { ClueTextComponent } from './ui/components/clue-text/clue-text.component';
import { CluesPreviewComponent } from './ui/components/clues-preview/clues-preview.component';
import { ContentPreviewComponent } from './ui/components/content-preview/content-preview.component';
import { HtmlAsIsPipe } from './ui/pipes/html-as-is.pipe';
import { ValidationMessageComponent } from './ui/components/validation-message/validation-message.component';
import { LoginControlComponent } from './ui/components/login-control/login-control.component';
import { ArchiveComponent } from './ui/puzzle-editing/archive/archive.component';
import { ProviderPipe } from './ui/pipes/provider.pipe';
import { PublishGridComponent } from './ui/puzzle-publishing/publish-grid/publish-grid.component';
import { ColorControlComponent } from './ui/components/color-control/color-control.component';
import { PublishLoginComponent } from './ui/puzzle-publishing/publish-login/publish-login.component';
import { TipComponent } from './ui/components/tip/tip.component';
import { TipInstanceFactory } from './ui/components/tip/tip-instance';
import { OpenPuzzleComponent } from './ui/puzzle-editing/open-puzzle/open-puzzle.component';
import { WordpressIdPipe } from './ui/pipes/wordpress-id.pipe';
import { IndyComponent } from './ui/puzzle-editing/indy/indy.component';
import { ConfirmModalComponent } from './ui/components/confirm-modal/confirm-modal.component';
import { GridEditorComponent } from './ui/puzzle-editing/grid-editor/grid-editor.component';
import { GridStartComponent } from './ui/puzzle-editing/grid-start/grid-start.component';
import { DownloadButtonComponent } from './ui/components/download-button/download-button.component';
import { DiaryAliasControlComponent } from './ui/components/diary-alias-control/diary-alias-control.component';
import { DiarySettingsEditorComponent } from './ui/components/diary-settings-editor/diary-settings-editor.component';
import { SpecialPdfComponent } from './ui/puzzle-editing/special-pdf/special-pdf.component';
import { SpecialComponent } from './ui/puzzle-editing/special/special.component';
import { SpecialTextComponent } from './ui/puzzle-editing/special-text/special-text.component';
import { ParseResultComponent } from './ui/components/parse-result/parse-result.component';
import { ParseErrorHintComponent } from './ui/components/parse-error-hint/parse-error-hint.component';
import { NavTrack } from './services/navigation/interfaces';
import { publishPostTrack } from './services/navigation/tracks/publish-post-track';
import { publishGridTrack } from './services/navigation/tracks/publish-grid-track';
import { NAV_TRACKS, NAV_PROCESSOR } from './services/navigation/nav.service';
import { CreatePuzzleComponent } from './ui/puzzle-editing/create-puzzle/create-puzzle.component';
import { CluesEditorComponent } from './ui/puzzle-editing/clues-editor/clues-editor.component';
import { ValidatePuzzleComponent } from './ui/puzzle-editing/validate-puzzle/validate-puzzle.component';
import { UIProcessService } from './services/navigation/ui-process.service';
import { CluesStartComponent } from './ui/puzzle-editing/clues-start/clues-start.component';
import { LinkErrorComponent } from './ui/puzzle-editing/link-error/link-error.component';
import { HomeComponent } from './ui/app-general/home/home.component';
import { LoginComponent } from './ui/app-general/login/login.component';
import { ReadmeComponent } from './ui/app-general/readme/readme.component';
import { SettingsComponent } from './ui/app-general/settings/settings.component';
import { DiaryComponent } from './ui/app-general/diary/diary.component';
import { SpecialLoginComponent } from './ui/puzzle-editing/special-login/special-login.component';
import { NavErrorComponent } from './ui/puzzle-editing/nav-error/nav-error.component';
import { ClueListItemComponent } from './ui/components/clue-list-item/clue-list-item.component';
import { solveTrack } from './services/navigation/tracks/solve-track';
import { createPdfTrack } from './services/navigation/tracks/create-pdf-track';
import { createGridAndTextTrack } from './services/navigation/tracks/create-grid-and-text-track';
import { createGridTrack } from './services/navigation/tracks/create-grid-track';
import { createTextTrack } from './services/navigation/tracks/create-text-track';
import { parseTrack } from './services/navigation/tracks/parse-track';
import { NavLogComponent } from './ui/components/nav-log/nav-log.component';
import { editPuzzleTrack } from './services/navigation/tracks/edit-puzzle-track';
import { ClueTextEditorComponent } from './ui/components/editor/forms/clue-text-editor/clue-text-editor.component';
import { PuzzleOptionsComponent } from './ui/components/editor/forms/puzzle-options/puzzle-options.component';
import { GridReferenceComponent } from './ui/components/editor/grid-reference/grid-reference.component';
import { GridLinkerComponent } from './ui/components/editor/forms/grid-linker/grid-linker.component';
import { ClueEditorComponent } from './ui/components/editor/clue-editor/clue-editor.component';
import { GridFormComponent } from './ui/components/editor/forms/grid-form/grid-form.component';
import { ClueEditorWrapComponent } from './ui/components/editor/clue-editor-wrap/clue-editor-wrap.component';

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

const tracks: ReadonlyArray<NavTrack> = [
    createTextTrack,
    createGridTrack,
    createGridAndTextTrack,
    createPdfTrack,
    parseTrack,
    solveTrack,
    editPuzzleTrack,
    publishPostTrack,
    publishGridTrack,
];

@NgModule({
    declarations: [
        HtmlAsIsPipe,
        ProviderPipe,
        AppComponent,
        GridComponent,
        ClueListComponent,
        SolverComponent,
        ClueAnnotationComponent,
        ClueTextControlComponent,
        ClueTextChunkComponent,
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
        LoginComponent,
        LoginControlComponent,
        ArchiveComponent,
        PublishGridComponent,
        ColorControlComponent,
        PublishLoginComponent,
        TipComponent,
        ReadmeComponent,
        SettingsComponent,
        OpenPuzzleComponent,
        WordpressIdPipe,
        IndyComponent,
        ConfirmModalComponent,
        GridEditorComponent,
        GridStartComponent,
        DownloadButtonComponent,
        DiaryComponent,
        DiaryAliasControlComponent,
        DiarySettingsEditorComponent,
        SpecialPdfComponent,
        SpecialComponent,
        SpecialTextComponent,
        ParseResultComponent,
        ParseErrorHintComponent,
        CreatePuzzleComponent,
        CluesEditorComponent,
        ValidatePuzzleComponent,
        CluesStartComponent,
        LinkErrorComponent,
        SpecialLoginComponent,
        NavErrorComponent,
        ClueListItemComponent,
        NavLogComponent,
        ClueTextEditorComponent,
        PuzzleOptionsComponent,
        GridReferenceComponent,
        GridLinkerComponent,
        ClueEditorComponent,
        GridFormComponent,
        ClueEditorWrapComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        BsDatepickerModule.forRoot(),
        HttpClientModule,
        QuillModule.forRoot(quillGlobalConfig),
        AppRoutingModule,
    ],
    providers: [
        PuzzleManagementService,
        {provide: IPuzzleManager, useExisting: PuzzleManagementService},
        {provide: IActivePuzzle, useExisting: PuzzleManagementService},
        HttpClient,
        TipInstanceFactory,
        {provide: NAV_TRACKS, useValue: tracks},
        {provide: NAV_PROCESSOR, useClass: UIProcessService},
    ],
    entryComponents: [
        ClueAnnotationComponent,
        ConfirmModalComponent,
        ClueTextEditorComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
