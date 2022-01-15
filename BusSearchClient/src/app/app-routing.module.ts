import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { CitiesComponent } from './components/cities/cities.component';
import { InputCityComponent } from './components/input-city/input-city.component';
import { InputLineComponent } from './components/input-line/input-line.component';
import { InputStationComponent } from './components/input-station/input-station.component';
import { StationsComponent } from './components/stations/stations.component';

const routes: Routes = [
  {
    path:"stations",
    component:StationsComponent
  },
  {
    path:"inputcity",
    component:InputCityComponent
  },
  {
    path:"inputstation",
    component:InputStationComponent
  },
  {
    path:"inputline",
    component:InputLineComponent
  },
  {
    path:"**",
    component:CitiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router){}
  redirect(path: string){
    this.router.navigate([path])
 }
 }
