import { Component, Input, OnInit, Output,EventEmitter, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { City } from 'src/app/Models/City-model';
import { Line } from 'src/app/Models/Line-model';
import { Station } from 'src/app/Models/Station-model';
import { DataService } from 'src/app/services/data.service';
import { AppState } from 'src/app/store/app-state';
import { selectCurrentCity } from 'src/app/store/data.selectors';


@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css'],

})
export class LinesComponent implements OnInit {
  lines: Observable<Line[]> = of([]);
  @Input() station: Station|null = null;
  @Input() events: Observable<boolean>;
  signalToChild: Subject<boolean> = new Subject<boolean>();
  custopmHeigh:string = "height: 0px; ";
  customClass:string = "hidden";
 // @Input() stationClicked: EventEmitter<Station|null> = new EventEmitter<Station|null>();
  constructor(private service: DataService,private store: Store<AppState>) { }

  ngOnInit(): void {

    this.events.subscribe((event)=>{
      if(event)//otvara
      {
        this.customClass ="show";
        this.custopmHeigh = "padding-bottom:20px; max-height:200px; transition:ease-out 1s ;";
      }
      else //zatvara
      {
        this.custopmHeigh = "height: 0px;";
        this.customClass="hidden";
      }
    })
    
    this.store.select(selectCurrentCity).subscribe((city:City)=>{
      if(this.station)
      this.lines =  this.service.getStationLines(city.name,this.station.name);
    });
  //  
  }

}
