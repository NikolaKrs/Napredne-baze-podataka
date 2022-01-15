import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BusCardComponent } from './components/bus-card/bus-card.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { dataReducer } from './store/data.reducer';
import { DataEffect } from './store/data.effects';
import { DataService } from './services/data.service';
import { CitiesComponent } from './components/cities/cities.component';
import { StationComponent } from './components/station/station.component';
import { StationsComponent } from './components/stations/stations.component';
import { SafePipe } from './pipes/safe.pipe';
import { LineComponent } from './components/line/line.component';
import { LinesComponent } from './components/lines/lines.component';
import { InputCityComponent } from './components/input-city/input-city.component';
import { InputStationComponent } from './components/input-station/input-station.component';
import { InputLineComponent } from './components/input-line/input-line.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';

@NgModule({
  declarations: [
    AppComponent,
    BusCardComponent,
    CitiesComponent,
    StationComponent,
    StationsComponent,
    SafePipe,
    LineComponent,
    LinesComponent,
    InputCityComponent,
    InputStationComponent,
    InputLineComponent,
    ChatComponent,
    ChatMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({data: dataReducer}),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    EffectsModule.forRoot([DataEffect])
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
