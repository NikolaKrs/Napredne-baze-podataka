import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dictionary } from '@ngrx/entity';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-input-city',
  templateUrl: './input-city.component.html',
  styleUrls: ['./input-city.component.css']
})

export class InputCityComponent implements OnInit {
  values:Map<string,string> = new Map<string,string>();
  constructor(private service: DataService,private router: Router) { }

  ngOnInit(): void {
  }

  Save()
  {
    if(this.values.has("cityName")&& this.values.has("cityLat") && this.values.has("cityLng"))
    this.service.createCity(this.values.get("cityName")??"Nema",this.values.get("cityLat")??"Nema",this.values.get("cityLng")??"Nema").subscribe(el=>{
      if(el == 200)
      {
        alert("Usposno ste uneli grad "+this.values.get("cityName")??"Nema");
        this.router.navigate(["/"]);
      }
      else
      {
        alert("Nije moguce uneti grad, pokusajte kasnije.");
      }
      
    });
    else
    alert("Niste uneli validne podatke.");
  
  } 

  changeValue(key:string,event:Event)
  {
    this.values.set(key,(event.target as HTMLInputElement).value);
  }

}
