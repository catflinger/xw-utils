# XwUtils

## Folder Structure
The code is under /src/app.  Directly insid this is the usual app and routing module.  The application code is grouped into sub-folders as follows:

### src/app/model
This section defines a read-only domain model for the application. These readonly entities are the only direct access the UI has to the model.
This comprises an abstract interface defining the data entites of the model and a set of concrete read-only classes that provide helper methods
for interogating the model and provide serialization/de-serializtion support.

### src/app/modifiers
This section defines a set of reducer objects that encapsulate the possible modifications on the model. This section includes a data-only writable interface
of the model to be used by the reducers when implmenting transforms on the main model.  

The naming convention for entities in the model uses prefixes and suffixes:
* Prefix I: the abstract domain entity
* No prefix: the readonly concrete implementation used by the UI
* Suffix M: a writeable interface used by the reducers

For example: the abstract entity _IPuzzle_ will have both a concrete readonly implementation _Puzzle_ (used by the UI) and a writeable interface _PuzzleM_ (used by the reducers).

### src/app/services

This section contains mainly singleton entites that serve as a link between the UI and its environment.  ActivePuzzle and PuzzleManagaer provide access to the
model from the UI (including access to the reducers). Other services including authentication, publishing to fifteensquared,downloading new puzzles and saving existing puzzles etc.

### src/app/services/navigation

This section encapsulates the process flow through the application.  Navigation through the application is abstracted into named nodes and actions. Graphs (enceded as JSON) can define sequences of domain-related events as well as invoking UI navigations via the Angular router.  One example of a process might be _PublishPostTrack_ which defines what order the publication screens will be displayed.

### sec/app/ui

This section contains the Angular components, pipes etc that make up the UI.

# Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## For Live Build:

ng build --configuration=production --prod --baseRef /angular/

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
