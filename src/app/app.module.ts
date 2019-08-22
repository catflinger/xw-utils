import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './ui/app/app.component';
import { GridTestComponent } from './ui/grid-test/grid-test.component';
import { GridComponent } from './ui/grid/grid/grid.component';
import { PuzzleService } from './services/puzzle.service';
import { ClueListComponent } from './ui/clue-list/clue-list.component';
import { SolverComponent } from './ui/solver/solver.component';
import { ClueEditorComponent } from './ui/clue-editor/clue-editor.component';
import { FormsModule } from '@angular/forms';
import { ClueTextComponent } from './ui/clue-text/clue-text.component';
import { ClueTextChunkComponent } from './ui/clue-text-chunk/clue-text-chunk.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    GridTestComponent,
    GridComponent,
    ClueListComponent,
    SolverComponent,
    ClueEditorComponent,
    ClueTextComponent,
    ClueTextChunkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [
      PuzzleService,
      HttpClient
  ],
  entryComponents: [
      ClueEditorComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
