import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridTestComponent } from './ui/grid-test/grid-test.component';
import { SolverComponent } from './ui/solver/solver.component';
import { HomeComponent } from './ui/home/home.component';
import { PublishOptionsComponent } from './ui/publish-options/publish-options.component';
import { UsernamePasswordComponent } from './ui/username-password/username-password.component';
import { PublishCompleteComponent } from './ui/publish-complete/publish-complete.component';


const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "grid-test", component: GridTestComponent },
    { path: "solver", component: SolverComponent },
    { path: "publish-options", component: PublishOptionsComponent },
    { path: "user-password", component: UsernamePasswordComponent },
    { path: "publish-complete", component: PublishCompleteComponent },
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "*", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
