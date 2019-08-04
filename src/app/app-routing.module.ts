import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridTestComponent } from './ui/grid-test/grid-test.component';


const routes: Routes = [
    { path: '', component: GridTestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
