# Snowball

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Hot to debug locally
Getting your local client port and secret
`wmic PROCESS WHERE name='LeagueClientUx.exe' GET commandline`
(or `ps -A | grep LeagueClientUx` on Mac)

Look for endpoint to explore via [LCU swagger](https://swagger.dysolix.dev/lcu)

You can find endpoints currently used in the project in methods of scripts in `services` folder

## Release local instance to Overwolf
1. Go into Overwolfs Settings -> About -> Development options
2. Use "Load unpacked" and choose built app folder - `dist/snowball/browser`

You can then use your local League Client to debug the app.
If you need logs use `console.log()` and in the same dev options view in Overwolf you will see under Snowball app "Inspect" options - usually "Main" is the one you want to inspect.
