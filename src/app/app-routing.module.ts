import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolverComponent } from './ui/puzzle-solving/solver/solver.component';
import { HomeComponent } from './ui/pages/home/home.component';
import { PublishOptionsComponent } from './ui/puzzle-publishing/publish-options/publish-options.component';
import { PublishComponent } from './ui/puzzle-publishing/publish/publish.component';
import { PublishCompleteComponent } from './ui/puzzle-publishing/publish-complete/publish-complete.component';
import { PublishPreambleComponent } from './ui/puzzle-publishing/publish-preamble/publish-preamble.component';
import { BloggerComponent } from './ui/puzzle-solving/blogger/blogger.component';
import { LoginComponent } from './ui/pages/login/login.component';
import { ArchiveComponent } from './ui/puzzle-editing/archive/archive.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PublishGridComponent } from './ui/puzzle-publishing/publish-grid/publish-grid.component';
import { PublishLoginComponent } from './ui/puzzle-publishing/publish-login/publish-login.component';
import { ReadmeComponent } from './ui/pages/readme/readme.component';
import { SettingsComponent } from './ui/pages/settings/settings.component';
import { OpenPuzzleComponent } from './ui/puzzle-editing/open-puzzle/open-puzzle.component';
import { IndyComponent } from './ui/puzzle-editing/indy/indy.component';
import { GridEditorComponent } from './ui/puzzle-editing/grid-editor/grid-editor.component';
import { GridStartComponent } from './ui/puzzle-editing/grid-start/grid-start.component';
import { DiaryComponent } from './ui/pages/diary/diary.component';
import { SpecialPdfComponent } from './ui/puzzle-editing/special-pdf/special-pdf.component';
import { SpecialComponent } from './ui/puzzle-editing/special/special.component';
import { SpecialTextComponent } from './ui/puzzle-editing/special-text/special-text.component';
import { CreatePuzzleComponent } from './ui/puzzle-editing/create-puzzle/create-puzzle.component';

const routes: Routes = [
    // landing pages
    { path: "home", component: HomeComponent },
    { path: "login", component: LoginComponent },

    // solving and blogging puzzles
    { path: "archive/:provider", component: ArchiveComponent },
    { path: "indy", component: IndyComponent },
    { path: "special", component: SpecialComponent },
    { path: "special-pdf", component: SpecialPdfComponent },
    { path: "open-puzzle", component: OpenPuzzleComponent },
    { path: "solver", component: SolverComponent },
    { path: "blogger", component: BloggerComponent },

    // publishing puzzles
    { path: "publish-options", component: PublishOptionsComponent },
    { path: "publish-grid", component: PublishGridComponent },
    { path: "publish-preamble", component: PublishPreambleComponent },
    { path: "publish-login", component: PublishLoginComponent },
    { path: "publish", component: PublishComponent },
    { path: "publish-complete", component: PublishCompleteComponent },

    // creating and editing grids
    { path: "create-puzzle", component: CreatePuzzleComponent },
    { path: "special-text", component: SpecialTextComponent },
    { path: "grid-start", component: GridStartComponent },
    { path: "grid-editor", component: GridEditorComponent },

    // general
    { path: "diary", component: DiaryComponent },
    { path: "readme", component: ReadmeComponent },
    { path: "settings", component: SettingsComponent },

    // default routes
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "*", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ]
})
export class AppRoutingModule { }
