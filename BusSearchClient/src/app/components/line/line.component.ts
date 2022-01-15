import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { Line } from 'src/app/Models/Line-model';
import { SignalRService } from 'src/app/services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app-state';
import { DataService } from 'src/app/services/data.service';
import { City } from 'src/app/Models/City-model';
import { selectCurrentCity } from 'src/app/store/data.selectors';
import { Station } from 'src/app/Models/Station-model';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css'],
  
})
export class LineComponent implements OnInit {
  recieveData:Subject<string>=new Subject()
  @Input() line:Line| null = null 
  @Input() station: Station | null = null
  minutes: string = "Nema autobusa";
  constructor(private service: DataService,public signalRService: SignalRService, private http: HttpClient,private store: Store<AppState>) { }

  ngOnInit(): void {
    if(this.line)
    {
      this.store.select(selectCurrentCity).subscribe((city:City)=>{
      if(this.line)
      {
      this.service.getStationTimes(city.name, this.line.name).subscribe((list)=>{
       this.line = <Line>({...this.line,stationTime:list})
      })

       this.signalRService.addListener(city.name+this.line.name,this.recieveData); 
      }
      
      });
     

      this.recieveData.subscribe((stationName:string)=>{
        let len:number = 0;

      let status:number = 0;
      this.line?.stationTime.forEach((el,ind)=>{
        if(el.start == stationName)
        {  
          status = 1;
        }
        if(status == 1 && el.start != this.station?.name)
        {
          len += el.time;
        }
        else{
          status = 2;
        }  
      });

      if(status == 2)
        this.minutes = ""+len+" min";
      else
        this.minutes ="Nema"

      });

    }
    
  }
  ngOnDestroy()
  {
    this.recieveData.next("")
    this.recieveData.complete()
    if(this.line)
    this.signalRService.removeListener(this.line.name)
  }

}
