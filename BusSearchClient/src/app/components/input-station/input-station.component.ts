import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { City } from 'src/app/Models/City-model';
import { Line } from 'src/app/Models/Line-model';
import { Station } from 'src/app/Models/Station-model';
import { DataService } from 'src/app/services/data.service';
import { AppState } from 'src/app/store/app-state';
import { selectAllCities } from 'src/app/store/data.selectors';

@Component({
  selector: 'app-input-station',
  templateUrl: './input-station.component.html',
  styleUrls: ['./input-station.component.css']
})
export class InputStationComponent implements OnInit {

  cities: Observable<City[]> = of([]);
  stations: Observable<Station[]> = of([]);
  lines: Observable<Line[]> = of([]);
  values:Map<string,string> = new Map<string,string>();
  constructor(private store: Store<AppState>,private service: DataService,private router: Router) { }

  ngOnInit(): void {

    this.cities = this.store.select(selectAllCities);
  
  }

  loadLines(event:Event)
  {
    const cityName = (event.target as HTMLInputElement).value;
    this.values.set("cityName",cityName);
    this.lines = this.service.getCityLines(cityName);
  }
  loadStations(event:Event)
  {
    const lineName = (event.target as HTMLInputElement).value;
    this.values.set("lineName",lineName);
    this.stations = this.service.getCityLinesStations(this.values.get("cityName")??"Nema",this.values.get("lineName")??"Nema");
  }

  changeValue(key:string,event:Event)
  {
    this.values.set(key,(event.target as HTMLInputElement).value);
  }

  Save(){
    this.service.createStation(this.values.get("cityName")??"Nema"
                              ,this.values.get("lineName")??"Nema"
                              ,this.values.get("stationName")??"Nema"
                              ,this.values.get("newStationName")??"Nema"
                              ,this.values.get("newStationLat")??"0"
                              ,this.values.get("newStationLng")??"0"
                              ,this.values.get("newStationTimeTo")??"0"
                              ,this.values.get("newStationTimeFrom")??"0").subscribe(reason=>{
                                if(reason == 200)
                                {
                                  alert("Usposno ste uneli stanicu"+this.values.get("newStationName")??"Nema");
                                  this.router.navigate(["/"]);
                                }
                                else
                                {
                                  alert("Nije moguce uneti stanicu, pokusajte kasnije.");
                                }
                              })
  }

}
