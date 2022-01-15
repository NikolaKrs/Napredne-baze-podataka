import { createSelector } from "@ngrx/store";
import { City } from "../Models/City-model";
import { Station } from "../Models/Station-model";
import { AppState } from "./app-state";

export const selectDataFeature = (state: AppState) => state.data;
export const selectAllCities = createSelector(
    selectDataFeature,
    (state) => state.cities
    .map(city=> <City> city)
);
export const selectCurrentCity = createSelector(
    selectDataFeature,
    (state) => <City> state.currentCity
);

export const selectAllStations = createSelector(
    selectDataFeature,
    (state) => state.stations
    .map(station=> <Station> station)
);



