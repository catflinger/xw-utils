import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolverComponent } from './ui/pages/solver/solver.component';
import { HomeComponent } from './ui/pages/home/home.component';
import { PublishOptionsComponent } from './ui/pages/publish-options/publish-options.component';
import { PublishComponent } from './ui/pages/publish/publish.component';
import { PublishCompleteComponent } from './ui/pages/publish-complete/publish-complete.component';
import { PublishPreambleComponent } from './ui/pages/publish-preamble/publish-preamble.component';
import { BloggerComponent } from './ui/pages/blogger/blogger.component';


const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "solver", component: SolverComponent },
    { path: "blogger", component: BloggerComponent },
    { path: "publish-options", component: PublishOptionsComponent },
    { path: "publish-preamble", component: PublishPreambleComponent },
    { path: "user-password", component: PublishComponent },
    { path: "publish-complete", component: PublishCompleteComponent },
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "*", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
