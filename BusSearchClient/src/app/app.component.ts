import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalRService } from './services/signal-r.service';
import { distinct, distinctUntilChanged, from, Observable, of, Subject } from 'rxjs';
import { BusCardComponent } from './components/bus-card/bus-card.component';
import { AppState } from './store/app-state';
import { Store } from '@ngrx/store';
import { loadCitiesStart } from './store/data.actions';
import { City } from './Models/City-model';
import { selectAllCities } from './store/data.selectors';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title="BusSearchClient"

  optionsBool:boolean = false;
  message:Subject<string>=new Subject()
  constructor(private http: HttpClient,private router: Router,public signalRService: SignalRService) { }

  ngOnInit() {
    this.signalRService.startConnection();
    this.startHttpRequest()
 //  this.cities = from([<City[]>[{id:1,name:"bus1"},{id:2, name:"bus2"}]])
  }
  ngOnDestroy()
  {
  }

  options(){
    const opt = document.querySelector(".options");
    if(!this.optionsBool)
    {
      opt?.classList.add("show");
      this.optionsBool = true;
      console.log("true")
    }
    else
    {
      opt?.classList.remove("show");
      this.optionsBool = false;
    }
    
  }
  choiseOption(name:string){
    if(name =="city")
    {
      this.router.navigate(["/inputcity"])
    }
    else if(name == "station")
    {
      this.router.navigate(["/inputstation"])
    }
    else if(name =="line")
    {
      this.router.navigate(["/inputline"])
    }
  }
  private startHttpRequest = () => {
    this.http.get('https://localhost:5001/api/bus')
      .subscribe(res => {
        console.log(res)
      })   }
 
}