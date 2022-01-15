import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { City } from '../Models/City-model';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Station } from '../Models/Station-model';
import { Line } from '../Models/Line-model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  public getAllCities(){
    return  this.httpClient.get<City[]>(environment.apiUrl+"getcities").pipe(
      catchError(errorHandler)
    )
  }

  public getCityStations(cityName:string){
    return  this.httpClient.get<Station[]>(environment.apiUrl+"getCityStations?City="+cityName).pipe(
      catchError(errorHandler)
    )
  }
  public getCityLinesStations(cityName:string, lineName:string){
    return  this.httpClient.get<Station[]>(environment.apiUrl+"getCityLineStations?City="+cityName+"&Line="+lineName).pipe(
      catchError(errorHandler)
    )
  }

  public getCityLines(cityName:string){
    return  this.httpClient.get<Line[]>(environment.apiUrl+"getCityLines?City="+cityName).pipe(
      catchError(errorHandler)
    )
  }

  public getStationLines(cityName:string, stationName:string){
    return  this.httpClient.get<Line[]>(environment.apiUrl+"getStationLines?City="+cityName+"&Station="+stationName).pipe(
      catchError(errorHandler)
    )
  }
  public getStationTimes(cityName:string, lineName:string){
    return  this.httpClient.get<{start:string,time:number}[]>(environment.apiUrl+"getStationTimes?City="+cityName+"&Line="+lineName).pipe(
      catchError(errorHandler)
    )
  }

  public createCity(cityName:string,lat:string,lng:string){
    return  this.httpClient.get(environment.apiUrl+"createCity?City="+cityName+"&lat="+lat+"&lng="+lng).pipe(
      catchError(errorHandler)
    )
  }
  public createStation(cityName:string, lineName:string,stationPrevious:string, stationNew:string, lat:string,lng:string, t1:string,t2:string){
    return  this.httpClient.get(environment.apiUrl+`createStation?City=${cityName}&stationPrevious=${stationPrevious}&stationNew=${stationNew}&lat=${lat}&lng=${lng}&Line=${lineName}&t1=${t1}&t2=${t2}`).pipe(
      catchError(errorHandler)
    )
  }
//(string City, string stationPrevious, string stationNew, string Line, int t1, int t2)


}


const errorHandler = (error: HttpErrorResponse) =>{
  const errorMessage = (error.status ===0)?
  'Cant connect to API'+ error.error:
  'Bakend returned code' + error.status;
  return throwError(errorMessage);
}
