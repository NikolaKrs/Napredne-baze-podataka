import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { City } from 'src/app/Models/City-model';
import { Station } from 'src/app/Models/Station-model';
import { AppState } from 'src/app/store/app-state';
import { loadCityStationsStart, setCurrentCity } from 'src/app/store/data.actions';
import { selectAllStations, selectCurrentCity } from 'src/app/store/data.selectors';
import { environment } from 'src/environments/environment';
import {Loader, LoaderOptions} from 'google-maps';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {
  stations: Observable<Station[]> = of([]);
  city:City;
  public mapCenter:string =  "";
  map: google.maps.Map;
   

  constructor(private store: Store<AppState>,private router: Router) { }

  stationClicked(station:Station|null)
  {
    if(station)
    {
      this.map.setCenter({lat: station.lat, lng: station.lng})
      this.map.setZoom(16);
    }
    else
    {
      this.map.setCenter({lat: this.city.lat, lng: this.city.lng})
      this.map.setZoom(10);
    }
    
  }

  ngOnInit(): void {
   this.store.select(selectCurrentCity).subscribe((city:City)=>{
    if(!city)
    {
      this.router.navigate(["/"])
      return;
    }
    this.city = city;
    this.store.dispatch(loadCityStationsStart({city:city}));
    this.stations = this.store.select(selectAllStations);

  
    const dom = document.querySelector('.map');
    if(dom)
    {
      const options: LoaderOptions = {/* todo */};
      const loader = new Loader('AIzaSyADCL9cSOE0zBfx7ykUGf1T-BZJ8W1Rkls&', options);

      loader.load().then( (google)=> {
         this.map = new google.maps.Map(dom, {
            center: {lat: city.lat, lng: city.lng},
            zoom: 10,   
        });

        this.stations.subscribe(s=>{
          s.forEach(station=>{
            var marker = new google.maps.Marker({
              position: {lat: station.lat, lng: station.lng},
              map: this.map,
              icon:{
                url: 'assets/img/bus-stop-pin.png',
                labelOrigin: new google.maps.Point(12,-8)
              },
              label: {text:station.name,color:"#FF0000",fontSize:"12px"},
              title: 'markers'
            });
          })
              

        })
        

      });

    }
  


   })
  }

}
