import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";  // or from "@microsoft/signalr" if you are using a new library
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: string;
  private hubConnection: signalR.HubConnection
  public startConnection = () => {
    if(!this.hubConnection)
    {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://localhost:5001/bus')
                            .build();
    
    this.hubConnection
      .start()
      .then(() => {console.log('Connection started ');
     //  this.hubConnection.invoke("SendMessage1").catch(err => console.log('greskaaaa : ' + err));
    })
      
      .catch(err => console.log('Error while starting connection: ' + err))
  }
}
  public sendChatMessage(user:string,message:string){
    this.hubConnection.invoke("SendMessage",user,message).catch(err => console.log('greskaaaa : ' + err));
  }
  public removeListener = (lineName:string) => this.hubConnection.off(lineName);
  
  public addListener = (lineName:string,recieveData:Subject<string>) => {

    this.hubConnection.on(lineName, (data) => {
      console.log("opet "+lineName)
      recieveData.next(data)
    });
  }

}