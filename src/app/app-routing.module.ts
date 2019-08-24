import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridTestComponent } from './ui/grid-test/grid-test.component';
import { SolverComponent } from './ui/solver/solver.component';
import { HomeComponent } from './ui/home/home.component';


const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "grid-test", component: GridTestComponent },
    { path: "solver", component: SolverComponent },
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "*", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
