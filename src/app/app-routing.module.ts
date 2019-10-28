import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolverComponent } from './ui/pages/solver/solver.component';
import { HomeComponent } from './ui/pages/home/home.component';
import { PublishOptionsComponent } from './ui/pages/publish-options/publish-options.component';
import { PublishComponent } from './ui/pages/publish/publish.component';
import { PublishCompleteComponent } from './ui/pages/publish-complete/publish-complete.component';
import { PublishPreambleComponent } from './ui/pages/publish-preamble/publish-preamble.component';
import { BloggerComponent } from './ui/pages/blogger/blogger.component';
import { LoginComponent } from './ui/pages/login/login.component';
import { ArchiveComponent } from './ui/pages/archive/archive.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PublishGridComponent } from './ui/pages/publish-grid/publish-grid.component';
import { PublishLoginComponent } from './ui/pages/publish-login/publish-login.component';
import { ReadmeComponent } from './ui/pages/readme/readme.component';
import { SettingsComponent } from './ui/pages/settings/settings.component';
import { OpenPuzzleComponent } from './ui/pages/open-puzzle/open-puzzle.component';
import { IndyComponent } from './ui/pages/indy/indy.component';


const routes: Routes = [
    // landing pages
    { path: "home", component: HomeComponent },
    { path: "login", component: LoginComponent },

    // solving and blogging puzzles
    { path: "archive/:provider", component: ArchiveComponent },
    { path: "indy", component: IndyComponent },
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

    // general
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
