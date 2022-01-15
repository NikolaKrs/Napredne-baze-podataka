import { createAction, props } from "@ngrx/store";
import { City } from "../Models/City-model";
import { Station } from "../Models/Station-model";


export const loadCitiesStart = createAction(
    "Load Cities"
    )

export const loadCitiesSuccess = createAction(
    "Load Cities Success",
        props<{
            cities: City[]
        }>()
    )


export const setCurrentCity = createAction(
    "Set current city",
        props<{
            city: City
        }>()
    )

export const loadCityStationsStart = createAction(
    "load City Stations Start",
        props<{
            city: City
        }>()
    ) 

export const loadCityStationsSuccess = createAction(
    "load City Stations Success",
        props<{
            stations: Station[]
        }>()
    )  
    
    
        
    