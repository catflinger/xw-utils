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
import { LoginComponent } from './ui/pages/login/login.component';
import { LoginControlComponent } from './ui/components/login-control/login-control.component';
import { ArchiveComponent } from './ui/pages/archive/archive.component';
import { ProviderPipe } from './ui/pipes/provider.pipe';
import { PublishGridComponent } from './ui/pages/publish-grid/publish-grid.component';
import { ColorControlComponent } from './ui/components/color-control/color-control.component';
import { PublishLoginComponent } from './ui/pages/publish-login/publish-login.component';
import { TipComponent } from './ui/components/tip/tip.component';
import { ReadmeComponent } from './ui/pages/readme/readme.component';
import { SettingsComponent } from './ui/pages/settings/settings.component';
import { TipInstanceFactory } from './ui/components/tip/tip-instance';
import { OpenPuzzleComponent } from './ui/pages/open-puzzle/open-puzzle.component';
import { WordpressIdPipe } from './ui/pipes/wordpress-id.pipe';
import { IndyComponent } from './ui/pages/indy/indy.component';
import { ConfirmModalComponent } from './ui/components/confirm-modal/confirm-modal.component';
import { GridEditorComponent } from './ui/pages/grid-editor/grid-editor.component';
import { GridStartComponent } from './ui/pages/grid-start/grid-start.component';
import { GridPropertiesEditorComponent } from './ui/components/grid-properties-editor/grid-properties-editor.component';
import { DownloadButtonComponent } from './ui/components/download-button/download-button.component';
import { DiaryComponent } from './ui/pages/diary/diary.component';
import { DiaryAliasControlComponent } from './ui/components/diary-alias-control/diary-alias-control.component';
import { DiarySettingsEditorComponent } from './ui/components/diary-settings-editor/diary-settings-editor.component';
import { SpecialPdfComponent } from './ui/pages/special-pdf/special-pdf.component';
import { SpecialComponent } from './ui/pages/special/special.component';
import { SpecialTextComponent } from './ui/pages/special-text/special-text.component';
import { ParseResultComponent } from './ui/components/parse-result/parse-result.component';
import { ParseErrorHintComponent } from './ui/components/parse-error-hint/parse-error-hint.component';
import { NavTrack } from './ui/navigation/interfaces';
import { publishPostTrack } from './ui/navigation/tracks/publish-post-track';
import { publishGridTrack } from './ui/navigation/tracks/publish-grid-track';
import { createGridTrack } from './ui/navigation/tracks/create-grid-track';
import { createCluesTrack } from './ui/navigation/tracks/create-clues-track';
import { createGridCluesTrack } from './ui/navigation/tracks/create-grid-clues-track';
import { openPuzzleTrack } from './ui/navigation/tracks/open-puzzle-track';
import { NAV_TRACKS, NAV_PROCESSOR } from './ui/navigation/nav.service';
import { CreatePuzzleComponent } from './ui/pages/create-puzzle/create-puzzle.component';
import { CluesEditorComponent } from './ui/pages/clues-editor/clues-editor.component';
import { ValidatePuzzleComponent } from './ui/pages/validate-puzzle/validate-puzzle.component';
import { AppProcessService } from './services/app-process.service';

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
    publishPostTrack,
    publishGridTrack,
    createGridTrack,
    createCluesTrack,
    createGridCluesTrack,
    openPuzzleTrack,
];


@NgModule({
    declarations: [
        HtmlAsIsPipe,
        ProviderPipe,
        AppComponent,
        GridComponent,
        ClueListComponent,
        SolverComponent,
        ClueEditorComponent,
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
        GridPropertiesEditorComponent,
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
        {provide: NAV_PROCESSOR, useClass: AppProcessService},
    ],
    entryComponents: [
        ClueEditorComponent,
        ConfirmModalComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
