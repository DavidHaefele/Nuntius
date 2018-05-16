import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
import { Content } from 'ionic-angular';
import { empty } from 'rxjs/Observer';
import { LocalNotifications } from '@ionic-native/local-notifications';

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
   conv: String;
   testname: any;
   resp: any;
   msgOut: any = { "conv": "", "message": "", "author": "" };
   messages = [];
   rawMsg = [];
   resposeData: any;
  d: number = 0;
  userData = { "conv": "" };
  id: any = 1;
  oldId: any;
  userDataC = { "conv": "", "oldId": "" };
  change: any;
  msgSent: Boolean;
  

  scrollToBottom() {
    this.content.scrollToBottom();
  }

  scrollHeight() {
    this.content.scrollHeight();
  }

  constructor(public navCtrl: NavController, params: NavParams, public app: App, private authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider, public localNotifications: LocalNotifications) {
    this.item = params.data.item;
    this.displayMessages();
    this.id = setInterval(() => {
      this.displayMessages();
    }, 500);
  }

  ionViewDidEnter() {
    this.content.scrollToBottom();
  }

  ionViewWillLeave() {
    clearInterval(this.id);
  }

  displayMessages() {
    this.getConv();
    if (this.userData.conv) {
      //Api connections
      this.authService.postData(this.userData, "displayMessages").then((result) => {
        this.resposeData = result;
        if (this.resposeData) {
          this.resp = JSON.stringify(this.resposeData.disMes);
          this.oldId = JSON.stringify(this.resposeData.oldId);
          console.log(this.oldId);
          this.deltaMsg();

          if (this.resp) {
            //console.log(this.resp);
            this.rawMsg = this.resp.split("̿̿̿’̵͇̿̿°");
            this.rawMsg[0] = this.rawMsg[0].substring(1);
            this.rawMsg.pop();

            for (this.d; this.d < this.rawMsg.length; this.d++) {
              if (this.d % 2 == 0) {
                if (this.rawMsg[this.d + 1] == this.storageH.getUsername().toString()) {
                  this.messages.push({ "message": this.rawMsg[this.d], "showown": true });
                }
                else {
                  this.messages.push({ "message": this.rawMsg[this.d], "showown": false });
                }
              }
            }
          }

        }
        else {
          console.log("Not found!");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast("Connection failed. Error: " + err);
      });
    }
    else {
      this.presentToast("Could not load messages. Try again!");
    }
  }

  msgSend() {
    this.msgSent = true;
    this.getConv();

    this.msgOut.conv = this.userData.conv;
    this.msgOut.author = this.storageH.getUsername().toString();
    console.log("Message Out: conv=" + this.msgOut.conv + " message=" + this.msgOut.message + " author=" + this.msgOut.author);

    if (this.msgOut) {
      //Api connections
      this.authService.postData(this.msgOut, "sendMessage").then((result) => {
        this.resposeData = result;
        if (this.resposeData) {
          this.resp = JSON.stringify(this.resposeData.total);
          this.msgOut.message = "";
          console.log(this.resp);
          this.scrollToBottom();
        }
        else {
          console.log("Not found!");
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


  deltaMsg() {
    if (this.msgSent) {
      this.msgSent = false;
    }

    else {
      this.getConv();

      this.userDataC.conv = this.userData.conv;
      this.userDataC.oldId = this.oldId;


      if (this.userDataC) {
        //Api connections
        this.authService.postData(this.userDataC, "deltaMsg").then((result) => {
          this.resposeData = result;
          if (this.resposeData) {
            this.change = JSON.stringify(this.resposeData.change);
            this.userDataC.oldId = "";
            console.log(this.change);

            if (this.change == '"1"') {
              this.notify();
            }
          }
          else {
            console.log("Not found!");
          }
        }, (err) => {
          //Connection failed message
          this.presentToast("Connection failed. Error: " + err);
        });
      }
      else {
        this.presentToast("Messgage not send. Try again!");
      }
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

  notify() {
    this.localNotifications.schedule({
      title: 'Nuntius',
      text: 'Du hast neue Nachrichten!',
      led: '0000FF',
    });
   }
}


