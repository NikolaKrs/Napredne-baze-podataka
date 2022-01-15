import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, Subject } from 'rxjs';
import { SignalRService } from '../../services/signal-r.service';
import { City } from 'src/app/Models/City-model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app-state';
import { setCurrentCity } from 'src/app/store/data.actions';

@Component({
  selector: 'app-bus-card',
  templateUrl: './bus-card.component.html',
  styleUrls: ['./bus-card.component.css']
})
export class BusCardComponent implements OnInit {

  message:string="nema";
  @Input() city:City|null= null;
  data:Subject<string>=new Subject()
  constructor(public signalRService: SignalRService,private router: Router,private store: Store<AppState>) { }

  ngOnInit(): void {
  }
  
  ShowLines(){
    if(this.city)
    {
       this.store.dispatch(setCurrentCity({city:this.city}));
       this.router.navigate(["/stations"])
    }
   
  }


}
