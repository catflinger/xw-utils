import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './ui/app/app.component';
import { GridTestComponent } from './ui/grid-test/grid-test.component';
import { GridComponent } from './ui/grid/grid/grid.component';

@NgModule({
  declarations: [
    AppComponent,
    GridTestComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
