import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { QuillModule } from "ngx-quill";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './ui/app/app.component';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { HomeComponent } from './ui/home/home.component';
import { PublishOptionsComponent } from './ui/publish-options/publish-options.component';
import { PublishComponent } from './ui/publish/publish.component';
import { PublishCompleteComponent } from './ui/publish-complete/publish-complete.component';
import { PublishPreambleComponent } from './ui/publish-preamble/publish-preamble.component';
import { ClueListComponent } from './ui/clue-list/clue-list.component';
import { SolverComponent } from './ui/solver/solver.component';
import { ClueEditorComponent } from './ui/clue-editor/clue-editor.component';
import { ClueTextComponent } from './ui/clue-text/clue-text.component';
import { ClueTextChunkComponent } from './ui/clue-text-chunk/clue-text-chunk.component';
import { GridComponent } from './ui/grid/grid/grid.component';

import { PuzzleService } from './services/puzzle.service';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ClueListComponent,
    SolverComponent,
    ClueEditorComponent,
    ClueTextComponent,
    ClueTextChunkComponent,
    NavbarComponent,
    HomeComponent,
    PublishOptionsComponent,
    PublishComponent,
    PublishCompleteComponent,
    PublishPreambleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
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
