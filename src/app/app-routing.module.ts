import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolverComponent } from './ui/solver/solver.component';
import { HomeComponent } from './ui/home/home.component';
import { PublishOptionsComponent } from './ui/publish-options/publish-options.component';
import { PublishComponent } from './ui/publish/publish.component';
import { PublishCompleteComponent } from './ui/publish-complete/publish-complete.component';
import { PublishPreambleComponent } from './ui/publish-preamble/publish-preamble.component';
import { BloggerComponent } from './ui/blogger/blogger.component';


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
