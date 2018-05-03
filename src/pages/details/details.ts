import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";

@Component({
    selector: 'page-details',
    templateUrl: 'details.html',
})
export class Details {
    item;
    data: String = "";
    author: any = "";
    name: any;
    testname: any;
    msgOut: any = { "message": "", "author": "" };
    resposeData: any;

  constructor(public navCtrl: NavController, params: NavParams, public app: App, private authService: AuthService, private toastCtrl: ToastController) {
    this.item = params.data.item;
    this.data = localStorage.getItem('userData');
    this.author = this.getUsername(this.data);
  }

  msgSend() {
    if (this.msgOut) {
      //Api connections
      this.authService.postData(this.msgOut, "sendMessage").then((result) => {
        this.resposeData = result;
        //this.presentToast("Message sending...");
        if (this.resposeData.msgOut) {
          this.presentToast(this.resposeData);
          //this.presentToast("Message send");
        }
        else {
          //this.presentToast("Message not send");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast("Connection failed. Error: "+err);
        });
    }
    else {
      this.presentToast("Messgage not send. Try again!");
    }
    this.presentToast("Name: " + this.author);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  getUsername(data : String) {
    this.name;
    this.name = data.split(",");
    this.name = this.name[1].split("\"");
    this.testname = this.name[3].split(",");
    return this.testname;
  }
}


