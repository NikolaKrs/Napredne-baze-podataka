import { Component, OnInit } from '@angular/core';
import { from, Observable, of, Subject, switchMap } from 'rxjs';
import { ChatMessage } from 'src/app/Models/Message-model';
import { SignalRService } from 'src/app/services/signal-r.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages:Subject<ChatMessage> = new Subject<ChatMessage>();
  element:HTMLElement|null;
  mymessage:string = "";
  inputMessageBox:HTMLInputElement|null;
  messageBox: HTMLElement|null;
  sessionId:number = 0;
  recieveData:Subject<string>=new Subject()
  constructor(public signalRService: SignalRService) { }

  ngOnInit(): void {
    this.sessionId = Math.round( 1000000+Math.random()*7999999);

    this.signalRService.addListener(this.sessionId.toString(),this.recieveData);

    this.recieveData.subscribe(recieveMessage=>{
      this.messages.next({text:recieveMessage,class:"messageleft"})
    })


   this.inputMessageBox = document.querySelector(".bgsend input");
   this.messageBox = document.querySelector(".messagebox");
   if(this.inputMessageBox)
   this.inputMessageBox.onkeypress = (ev)=>{
    if(ev.key == "Enter")
    this.sendMessage();
  }
    this.element = document.querySelector(".innermessagebox");


    this.messages.subscribe((m:ChatMessage)=>{
      if(this.element)
      {
         const mojdiv = document.createElement("div");
          mojdiv.classList.add(m.class);
          mojdiv.innerHTML = m.text;
          this.element.append(mojdiv);
      }
    })

    //this.messages1 = of( [{text:"asda asda  sad as d",class:"messageleft"} as ChatMessage,{text:"asda asda  sad as d",class:"messageleft"} as ChatMessage])
   /* this.messages.next({text:"asda asda  sad as d",class:"messageleft"});
    this.messages.next({text:"asda asda  sad asss d",class:"messageleft"});
    this.messages.next({text:"asda asda  sad as d",class:"messageright"});*/

  }


  sendMessage()
  {
    if(this.inputMessageBox?.value.length??0 > 0)
    {
       this.messages.next({text:this.inputMessageBox?.value??"Greska",class:"messageright"});
       this.signalRService.sendChatMessage(""+this.sessionId,this.inputMessageBox?.value??"Greska");
    }
    

    if(this.inputMessageBox)
     this.inputMessageBox.value = "";
  }

  OpenBox(){
    this.messageBox?.classList.toggle("show");
  }

}
