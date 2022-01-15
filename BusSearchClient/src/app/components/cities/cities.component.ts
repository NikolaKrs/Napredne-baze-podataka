import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { City } from 'src/app/Models/City-model';
import { AppState } from 'src/app/store/app-state';
import { loadCitiesStart } from 'src/app/store/data.actions';
import { selectAllCities } from 'src/app/store/data.selectors';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  cities: Observable<City[]> = of([]);
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.dispatch(loadCitiesStart());
    this.cities = this.store.select(selectAllCities);
  }

}
