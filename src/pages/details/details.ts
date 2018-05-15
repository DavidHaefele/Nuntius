import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';

@Component({
    selector: 'page-details',
    templateUrl: 'details.html',
})
export class Details {
   @ViewChild('content') content:any;
   item;
   author: String = "";
   name: any;
   t: number = 0;
  Convarr = [];
  authorarr = [];
   conv: String;
   testname: any;
   resp: any;
   msgOut: any = { "conv": "", "message": "", "author": "" };
   messages = [];
   messagesRaw = [];
   MsgData = { "conv": "", "nr": ""};
   resposeData: any;
   d: number = 0;
   i: number = 0;
  x: number = 0;
  f: number = 0;
  p: number = 0;
  rawrawmsg: String = "";
   MsgNr: number;
   authors = [];
   userData = { "conv": "" };
  

  scrollToBottom() {
    this.content.scrollToBottom();
  }

  constructor(public navCtrl: NavController, params: NavParams, public app: App, private authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider) {
    this.item = params.data.item;
    this.displayMessages();
  }

  ionViewDidEnter() {
    this.content.scrollToBottom(300);
  }

  displayMessages() {
    this.getConv();
    this.f = 0;
    this.resp = "";


    if (this.userData.conv) {
      //Api connections
      console.log("In getMessageNumber: " +this.userData.conv);
      this.authService.postData(this.userData, "getMessageNumber").then((result) => {
        this.resposeData = result;
        if (this.resposeData) {
          this.MsgNr = this.resposeData.disMes.total_messages;
          if (this.MsgNr) {

            for (this.i = 0; this.i < this.MsgNr; this.i++) {
              this.MsgData = { "conv": this.userData.conv, "nr": this.i.toString() };
              if (this.MsgData) {
                this.authService.postData(this.MsgData, "getMessage").then((result) => {
                  this.resposeData = result;
                  this.f++;
                  if (this.resposeData) {
                    this.resp = JSON.stringify(this.resposeData.disMes);
                    if (this.resp) {
                      this.rawrawmsg = this.resp.substring(1, this.resp.length - 1);
                      this.messagesRaw.push(this.rawrawmsg);
                      if (this.f == this.MsgNr - 1) {
                        this.fillMessages();
                      }
                    }
                    else {
                      console.log("Not1 found!");
                    }
                  }
                }, (err) => {
                  //Connection failed message
                  console.log("Connection failed. Error: " + err);
                });
              }
              else {
                console.log("Could not load messages. Try again!");
              }
            }

          }
        }
        else {
          console.log("Not found!");
        }
      }, (err) => {
        //Connection failed message
        console.log("Connection failed. Error: " + err);
      });
    }
    else {
      console.log("Could not load messages. Try again!");
    }
  }

  msgSend() {
    this.getConv();
    this.msgOut.conv = this.userData.conv;
    this.msgOut.author = this.storageH.getUsername().toString();

    if (this.msgOut) {
      //Api connections
      this.authService.postData(this.msgOut, "sendMessage").then((result) => {
        this.resposeData = result;
        if (this.resposeData) {
          this.resp = JSON.stringify(this.resposeData.total);
          this.msgOut.message = "";
        }
        else {
          console.log("Not2 found!");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast("Connection failed. Error: "+err);
        });
    }
    else {
      this.presentToast("Messgage not send. Try again!");
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  getConv() {
    this.Convarr = [];
    this.author = this.storageH.getUsername();
    this.Convarr.push({ "username": this.author.toString() });
    this.Convarr.push({ "username": this.item.name.toString() });
    this.Convarr.sort(function (a, b) {
      var nameA = a.username.toLowerCase(), nameB = b.username.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });


    this.userData.conv = this.Convarr[0].username + ":" + this.Convarr[1].username;
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.displayMessages();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  fillMessages() {
    this.authorarr = [];
    this.authors = [];
    if (this.messagesRaw) {
      this.authService.postData(this.userData, "getAuthors").then((result) => {
        this.resposeData = result;
        if (this.resposeData) {
          this.resp = JSON.stringify(this.resposeData.disMes);
          if (this.resp) {
            this.authorarr = this.resp.split(":");
            this.authorarr.pop();
            this.authorarr[0] = this.authorarr[0].substring(1);

            for (this.x = 0; this.x < this.authorarr.length; this.x++) {
              this.authors.push(this.authorarr[this.x]);
            }
            
            for (this.p = 0; this.p < this.messagesRaw.length; this.p++) {

              if (this.authors[this.p] == this.storageH.getUsername()) {
                this.messages.push({ "message": this.messagesRaw[this.p], "showown": true });
              } else {
                this.messages.push({ "message": this.messagesRaw[this.p], "showown": false });
              }
            }
          }

        }
        else {
          console.log("Not3 found!");
        }
      }, (err) => {
        //Connection failed message
        console.log("Connection failed. Error: " + err);
      });
    }
    else {
      console.log("Could not load messages. Try again!");
    }
  }
}


