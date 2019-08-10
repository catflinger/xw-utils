import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridTestComponent } from './ui/grid-test/grid-test.component';
import { SolverComponent } from './ui/solver/solver.component';


const routes: Routes = [
    { path: "grid-test", component: GridTestComponent },
    { path: "solver", component: SolverComponent },
    { path: "", redirectTo: "/grid-test", pathMatch: "full" },
    { path: "*", redirectTo: "/grid-test", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
