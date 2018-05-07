import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';

@Component({
    selector: 'page-details',
    templateUrl: 'details.html',
})
export class Details {
    item;
    author: any = "";
    name: any;
    Convarr = [];
    conv: String;
    testname: any;
    resp;
    msgOut: any = { "conv": "", "message": "", "author": "" };
    resposeData: any;

  constructor(public navCtrl: NavController, params: NavParams, public app: App, private authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider) {
    this.item = params.data.item;
  }

  msgSend() {
    this.Convarr = [];
    this.author = this.storageH.getUsername();
    this.Convarr.push({ "username": this.author.toString() });
    this.Convarr.push({ "username": this.item.name.toString()});
    this.Convarr.sort(function (a, b) {
      var nameA = a.username.toLowerCase(), nameB = b.username.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });
    

    this.conv = this.Convarr[0].username + ":" + this.Convarr[1].username;

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
}


