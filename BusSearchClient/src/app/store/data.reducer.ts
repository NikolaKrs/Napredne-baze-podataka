import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { City } from "../Models/City-model";
import { Station } from "../Models/Station-model";
import * as Actions from "./data.actions"

export interface DataState{
cities: City[]
currentCity: City | null
stations:Station[]
}

const adapter = createEntityAdapter<City>();

export const initialState: DataState = {cities:[],currentCity:null,stations:[{name:"Stanica",lat:10,lng:10},{name:"Stanica",lat:10,lng:10},{name:"Stanica",lat:10,lng:10}]}



export const dataReducer = createReducer(
    initialState,
    on(Actions.loadCitiesSuccess, (state, {cities}) => {
      // cities = cities.map((obj,ind) =>({...obj,id:ind}));     
    return {...state,cities:cities}
    }),
    on(Actions.setCurrentCity, (state, {city}) => {    
     return {...state,currentCity:city}
     }),
     on(Actions.loadCityStationsSuccess, (state, {stations}) => {    
      return {...state,stations:stations}
      })
);


