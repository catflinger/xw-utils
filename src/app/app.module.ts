import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { QuillModule } from "ngx-quill";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MarkdownModule } from 'ngx-markdown';

import { AppComponent } from './ui/app/app.component';
import { PublishOptionsComponent } from './ui/puzzle-publishing/publish-options/publish-options.component';
import { PublishComponent } from './ui/puzzle-publishing/publish/publish.component';
import { PublishCompleteComponent } from './ui/puzzle-publishing/publish-complete/publish-complete.component';
import { PublishPreambleComponent } from './ui/puzzle-publishing/publish-preamble/publish-preamble.component';
import { ClueListComponent } from './ui/clues/clue-list/clue-list.component';
import { SolverComponent } from './ui/puzzle-solving/solver/solver.component';
import { ClueAnnotationComponent } from './ui/puzzle-editing/tabbed-editor/forms/clue-annotator/clue-annotator.component';
import { ClueTextChunkComponent } from './ui/clues/clue-text-chunk/clue-text-chunk.component';

import { PuzzleManagementService, IPuzzleManager, IActivePuzzle } from './services/puzzles/puzzle-management.service';
import { AlertComponent } from './ui/general/guides/alert/alert.component';
import { TextStyleComponent } from './ui/puzzle-publishing/text-style/text-style.component';
import { BloggerComponent } from './ui/puzzle-solving/blogger/blogger.component';
import { ClueTextControlComponent } from './ui/clues/clue-text-control/clue-text-control.component';
import { ClueTextComponent } from './ui/clues/clue-text/clue-text.component';
import { ContentPreviewComponent } from './ui/puzzle-publishing/content-preview/content-preview.component';
import { HtmlAsIsPipe } from './ui/general/html-as-is.pipe';
import { ValidationMessageComponent } from './ui/general/validation-message/validation-message.component';
import { LoginControlComponent } from './ui/general/login-control/login-control.component';
import { ArchiveComponent } from './ui/puzzle-editing/archive/archive.component';
import { ProviderPipe } from './ui/general/provider.pipe';
import { PublishGridComponent } from './ui/puzzle-publishing/publish-grid/publish-grid.component';
import { ColorControlComponent } from './ui/puzzle-publishing/color-control/color-control.component';
import { PublishLoginComponent } from './ui/puzzle-publishing/publish-login/publish-login.component';
import { TipComponent } from './ui/general/guides/tip/tip.component';
import { TipInstanceFactory } from './ui/general/guides/tip/tip-instance';
import { OpenPuzzleComponent } from './ui/puzzle-editing/open-puzzle/open-puzzle.component';
import { WordpressIdPipe } from './ui/general/wordpress-id.pipe';
import { IndyComponent } from './ui/puzzle-editing/indy/indy.component';
import { ConfirmModalComponent } from './ui/general/confirm-modal/confirm-modal.component';
import { GridEditorComponent } from './ui/puzzle-editing/grid-editor/grid-editor.component';
import { GridStartComponent } from './ui/puzzle-editing/grid-start/grid-start.component';
import { DiaryAliasControlComponent } from './ui/diary/diary-alias-control/diary-alias-control.component';
import { DiarySettingsEditorComponent } from './ui/diary/diary-settings-editor/diary-settings-editor.component';
import { SpecialPdfComponent } from './ui/puzzle-editing/special-pdf/special-pdf.component';
import { SpecialComponent } from './ui/puzzle-editing/special/special.component';
import { SpecialTextComponent } from './ui/puzzle-editing/special-text/special-text.component';
import { ParseResultComponent } from './ui/puzzle-editing/parse-result/parse-result.component';
import { ParseErrorHintComponent } from './ui/general/guides/parse-error-hint/parse-error-hint.component';
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
import { HomeComponent } from './ui/home/home/home.component';
import { LoginComponent } from './ui/general/login/login.component';
import { ReadmeComponent } from './ui/home/readme/readme.component';
import { SettingsComponent } from './ui/general/settings/settings.component';
import { DiaryComponent } from './ui/diary/diary/diary.component';
import { SpecialLoginComponent } from './ui/puzzle-editing/special-login/special-login.component';
import { NavErrorComponent } from './ui/puzzle-editing/nav-error/nav-error.component';
import { ClueListItemComponent } from './ui/clues/clue-list-item/clue-list-item.component';
import { solveTrack } from './services/navigation/tracks/solve-track';
import { createPdfTrack } from './services/navigation/tracks/create-pdf-track';
import { parseTrack } from './services/navigation/tracks/parse-track';
import { NavLogComponent } from './ui/general/nav-log/nav-log.component';
import { editPuzzleTrack } from './services/navigation/tracks/edit-puzzle-track';
import { ClueTextEditorComponent } from './ui/puzzle-editing/tabbed-editor/forms/clue-text-editor/clue-text-editor.component';
import { PuzzleOptionsComponent } from './ui/puzzle-editing/tabbed-editor/forms/puzzle-options/puzzle-options.component';
import { GridReferenceComponent } from './ui/puzzle-editing/tabbed-editor/grid-reference/grid-reference.component';
import { GridLinkerComponent } from './ui/puzzle-editing/tabbed-editor/forms/grid-linker/grid-linker.component';
import { ClueEditorComponent } from './ui/puzzle-editing/tabbed-editor/clue-editor/clue-editor.component';
import { GridFormComponent } from './ui/puzzle-editing/tabbed-editor/forms/grid-form/grid-form.component';
import { AddRemoveClueComponent } from './ui/puzzle-editing/tabbed-editor/forms/add-remove-clue/add-remove-clue.component';
import { PuzzleEditorComponent } from './ui/puzzle-editing/tabbed-editor/puzzle-editor/puzzle-editor.component';
import { AddClueComponent } from './ui/puzzle-editing/tabbed-editor/forms/add-clue/add-clue.component';
import { BackupComponent } from './ui/backup/backup/backup.component';
import { BackupsComponent } from './ui/backup/backups/backups.component';
import { BackupSettingsComponent } from './ui/backup/backup-settings/backup-settings.component';
import { BackupOptionsComponent } from './ui/backup/backup-options/backup-options.component';
import { InfoPanelComponent } from './ui/general/guides/info-panel/info-panel.component';
import { PuzzleInfoFormComponent } from './ui/puzzle-editing/tabbed-editor/forms/puzzle-info-form/puzzle-info-form.component';
import { AnnouncementsComponent } from './ui/home/announcements/announcements.component';
import { PuzzleHubComponent } from './ui/puzzle-editing/puzzle-hub/puzzle-hub.component';
import { createPuzzleTrack } from './services/navigation/tracks/create-puzzle-track';
import { ClueEditListComponent } from './ui/clues/clue-edit-list/clue-edit-list.component';
import { PuzzleInfoComponent } from './ui/puzzle-editing/puzzle-info/puzzle-info.component';
import { gridToolTrack } from './services/navigation/tracks/grid-tool-track';
import { AboutComponent } from './ui/home/about/about.component';
import { IssuesComponent } from './ui/home/issues/issues.component';
import { GridComponent } from './ui/grid/grid/grid.component';
import { AdminComponent } from './ui/general/admin/admin.component';
import { CheatFormComponent } from './ui/puzzle-editing/tabbed-editor/forms/cheat-form/cheat-form.component';
import { PublishPreviewComponent } from './ui/puzzle-publishing/publish-preview/publish-preview.component';
import { NinaFinderComponent } from './ui/puzzle-publishing/nina-finder/nina-finder.component';
import { GridImageComponent } from './ui/puzzle-editing/grid-image/grid-image.component';
import { ProvisionOptionsControlComponent } from './ui/puzzle-editing/provision-options-control/provision-options-control.component';
import { ClueOptionsFormComponent } from './ui/puzzle-editing/tabbed-editor/forms/clue-options-form/clue-options-form.component';

const quillGlobalConfig = {
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            ['link']
        ]
    }
};

const tracks: ReadonlyArray<NavTrack> = [
    createPuzzleTrack,
    createPdfTrack,
    parseTrack,
    gridToolTrack,
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
        AddRemoveClueComponent,
        PuzzleEditorComponent,
        AddClueComponent,
        BackupComponent,
        BackupsComponent,
        BackupSettingsComponent,
        BackupOptionsComponent,
        InfoPanelComponent,
        PuzzleInfoFormComponent,
        AnnouncementsComponent,
        PuzzleHubComponent,
        ClueEditListComponent,
        PuzzleInfoComponent,
        AboutComponent,
        IssuesComponent,
        AdminComponent,
        CheatFormComponent,
        PublishPreviewComponent,
        NinaFinderComponent,
        GridImageComponent,
        ProvisionOptionsControlComponent,
        ClueOptionsFormComponent,
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
        MarkdownModule.forRoot(),
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
