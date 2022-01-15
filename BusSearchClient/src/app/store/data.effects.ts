import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DataService } from "../services/data.service";
import * as DataActions from "./data.actions"

import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

@Injectable()
export class DataEffect {

    constructor(private dataService: DataService, private actions$: Actions) { }

    loadEffect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DataActions.loadCitiesStart),
            mergeMap(() =>
             this.dataService.getAllCities()
             .pipe(
                    map((cities) => 
                        DataActions.loadCitiesSuccess({cities:cities})
                    ),
                    catchError(() => of({ type: "load error" }))
                )
            )
        )
    );


    loadCityStationEffect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DataActions.loadCityStationsStart),
            mergeMap((action) =>
             this.dataService.getCityStations(action.city.name)
             .pipe(
                    map((stations) => 
                        DataActions.loadCityStationsSuccess({stations:stations})
                    ),
                    catchError(() => of({ type: "load error" }))
                )
            )
        )
    );

}