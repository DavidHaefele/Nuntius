import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
import { Content } from 'ionic-angular';

@Component({
    selector: 'page-details',
    templateUrl: 'details.html',
})
export class Details {
    @ViewChild('content') content:any;
    item;
    author: any = "";
    name: any;
    t: number = 0;
    Convarr = [];
    conv: String;
    testname: any;
    resp;
    msgOut: any = { "conv": "", "message": "", "author": "" };
    messages = [{ "number": "1", "message": "Du wolltest mich sehen?", "author": "Cookie" },
              { "number": "2", "message": "Ja setz dich.", "author": "Bifius" },
              { "number": "3", "message": "Danke, Kanzler", "author": "Cookie" },
              { "number": "4", "message": "Did you ever hear the Tragedy of Darth Plagueis the Wise? I thought not. It's not a story the Jedi would tell you. It's a Sith legend. Darth Plagueis was a Dark Lord of the Sith, so powerful and so wise he could use the Force to influence the midichlorians to create life... He had such a knowledge of the dark side that he could even keep the ones he cared about from dying. The dark side of the Force is a pathway to many abilities some consider to be unnatural. He became so powerful... the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. It's ironic he could save others from death, but not himself.", "author": "Bifius" },
              { "number": "5", "message": "Ok ich untergebe mich euren Lehren, mein Meister!", "author": "Cookie" }];
    resposeData: any;

  scrollToBottom() {
    this.content.scrollToBottom();
  }

  constructor(public navCtrl: NavController, params: NavParams, public app: App, private authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider) {
    this.item = params.data.item;
  }
  ionViewDidEnter() {
    this.content.scrollToBottom(300);
  }

  displayMessages() {
    this.getConv();
    if (this.conv) {
      //Api connections
      this.authService.postData(this.msgOut, "displayMessages").then((result) => {
        this.resposeData = result;
        if (this.resposeData) {
          this.resp = JSON.stringify(this.resposeData);
          console.log(this.resp);
          for (this.t = 0; this.t < this.resp.disMes.length; this.t++) {
            this.messages[this.t] = this.resp.disMes[this.t];
            console.log(this.messages);
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
    this.getConv();

    this.msgOut.conv = this.conv;
    this.msgOut.author = this.author;

    console.log("Message Out: conv=" + this.msgOut.conv + " message=" + this.msgOut.message + " author=" + this.msgOut.author);

    if (this.msgOut) {
      //Api connections
      this.authService.postData(this.msgOut, "sendMessage").then((result) => {
        this.resposeData = result;
        if (this.resposeData) {
          this.resp = JSON.stringify(this.resposeData.total);
          console.log(this.resp);

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


    this.conv = this.Convarr[0].username + ":" + this.Convarr[1].username;
  }
}


