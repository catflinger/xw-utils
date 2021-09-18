import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolverComponent } from './ui/puzzle-solving/solver/solver.component';
import { PublishOptionsComponent } from './ui/puzzle-publishing/publish-options/publish-options.component';
import { PublishComponent } from './ui/puzzle-publishing/publish/publish.component';
import { PublishCompleteComponent } from './ui/puzzle-publishing/publish-complete/publish-complete.component';
import { PublishPreambleComponent } from './ui/puzzle-publishing/publish-preamble/publish-preamble.component';
import { BloggerComponent } from './ui/puzzle-solving/blogger/blogger.component';
import { ArchiveComponent } from './ui/puzzle-editing/archive/archive.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PublishGridComponent } from './ui/puzzle-publishing/publish-grid/publish-grid.component';
import { PublishLoginComponent } from './ui/puzzle-publishing/publish-login/publish-login.component';
import { OpenPuzzleComponent } from './ui/puzzle-editing/open-puzzle/open-puzzle.component';
import { IndyComponent } from './ui/puzzle-editing/indy/indy.component';
import { GridEditorComponent } from './ui/puzzle-editing/grid-editor/grid-editor.component';
import { GridStartComponent } from './ui/puzzle-editing/grid-start/grid-start.component';
import { SpecialPdfComponent } from './ui/puzzle-editing/special-pdf/special-pdf.component';
import { SpecialComponent } from './ui/puzzle-editing/special/special.component';
import { SpecialTextComponent } from './ui/puzzle-editing/special-text/special-text.component';
import { CreatePuzzleComponent } from './ui/puzzle-editing/create-puzzle/create-puzzle.component';
import { HomeComponent } from './ui/home/home/home.component';
import { LoginComponent } from './ui/general/login/login.component';
import { DiaryComponent } from './ui/diary/diary/diary.component';
import { ReadmeComponent } from './ui/home/readme/readme.component';
import { SettingsComponent } from './ui/general/settings/settings.component';
import { SpecialLoginComponent } from './ui/puzzle-editing/special-login/special-login.component';
import { NavErrorComponent } from './ui/puzzle-editing/nav-error/nav-error.component';
import { LinkErrorComponent } from './ui/puzzle-editing/link-error/link-error.component';
import { CluesEditorComponent } from './ui/puzzle-editing/clues-editor/clues-editor.component';
import { CluesStartComponent } from './ui/puzzle-editing/clues-start/clues-start.component';
import { BackupsComponent } from './ui/backup/backups/backups.component';
import { BackupComponent } from './ui/backup/backup/backup.component';
import { BackupSettingsComponent } from './ui/backup/backup-settings/backup-settings.component';
import { BackupOptionsComponent } from './ui/backup/backup-options/backup-options.component';
import { AnnouncementsComponent } from './ui/home/announcements/announcements.component';
import { PuzzleHubComponent } from './ui/puzzle-editing/puzzle-hub/puzzle-hub.component';
import { PuzzleInfoComponent } from './ui/puzzle-editing/puzzle-info/puzzle-info.component';
import { AboutComponent } from './ui/home/about/about.component';
import { IssuesComponent } from './ui/home/issues/issues.component';
import { AdminComponent } from './ui/general/admin/admin.component';
import { PublishPreviewComponent } from './ui/puzzle-publishing/publish-preview/publish-preview.component';
import { NinaFinderComponent } from './ui/puzzle-publishing/nina-finder/nina-finder.component';
import { GridImageComponent } from './ui/puzzle-editing/grid-image/grid-image.component';
import { GridFillerComponent } from './ui/puzzle-solving/jigsaw/grid-filler/grid-filler.component';

const routes: Routes = [

    // landing pages
    { path: "home", component: HomeComponent },
    { path: "login", component: LoginComponent },

    // solving and blogging puzzles
    { path: "solver", component: SolverComponent },
    { path: "blogger", component: BloggerComponent },
    { path: "jigsaw", component: GridFillerComponent },

    // publishing puzzles
    { path: "publish-options", component: PublishOptionsComponent },
    { path: "publish-grid", component: PublishGridComponent },
    { path: "publish-preamble", component: PublishPreambleComponent },
    { path: "publish-preview", component: PublishPreviewComponent },
    { path: "publish-login", component: PublishLoginComponent },
    { path: "publish", component: PublishComponent },
    { path: "publish-complete", component: PublishCompleteComponent },

    // creating and editing puzzles and grids
    { path: "archive/:provider", component: ArchiveComponent },
    { path: "indy", component: IndyComponent },
    { path: "special", component: SpecialComponent },
    { path: "special-pdf", component: SpecialPdfComponent },
    { path: "special-login", component: SpecialLoginComponent },
    { path: "puzzle-hub", component: PuzzleHubComponent },
    
    { path: "open-puzzle", component: OpenPuzzleComponent },
    { path: "create-puzzle", component: CreatePuzzleComponent },
    { path: "special-text", component: SpecialTextComponent },
    { path: "grid-start", component: GridStartComponent },
    { path: "grid-editor", component: GridEditorComponent },
    { path: "grid-image", component: GridImageComponent },
    { path: "nina-finder", component: NinaFinderComponent },
    { path: "clues-start", component: CluesStartComponent },
    { path: "clues-editor", component: CluesEditorComponent },
    { path: "puzzle-info", component: PuzzleInfoComponent },
    { path: "nav-error", component: NavErrorComponent },
    { path: "link-error", component: LinkErrorComponent },

    // general
    { path: "about", component: AboutComponent },
    { path: "announcements", component: AnnouncementsComponent },
    { path: "issues", component: IssuesComponent },
    { path: "readme", component: ReadmeComponent },
    { path: "admin", component: AdminComponent },

    { path: "diary", component: DiaryComponent },
    { path: "settings", component: SettingsComponent },
    { path: "backups", component: BackupsComponent },
    { path: "backup", component: BackupComponent },
    { path: "backup-settings", component: BackupSettingsComponent },
    { path: "backup-options/:id", component: BackupOptionsComponent },

    // default routes
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "*", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ]
})
export class AppRoutingModule { }
