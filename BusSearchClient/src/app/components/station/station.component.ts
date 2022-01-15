import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Station } from 'src/app/Models/Station-model';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {

  @Input() station:Station| null = null 
  private show:boolean= false;
  @Output() cardClicked: EventEmitter<Station|null> = new EventEmitter<Station|null>();
  signalToChild: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  ngOnInit(): void {
  
  }

  Klik(event:Event){
    const element = (event.target as HTMLElement).parentElement?.querySelector(".lines");
    console.log(element)

 

    if(this.show == false)
    {
      if(element && this.station)
        this.cardClicked.emit(this.station);
        this.signalToChild.next(true);

      element?.classList.remove("hidden")
      this.show=true;
    }
    else
    {
      this.cardClicked.emit(null);
      this.signalToChild.next(false);
      element?.classList.add("hidden")
      this.show=false;
    }
    
  }

}
