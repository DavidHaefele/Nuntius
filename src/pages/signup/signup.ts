import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";

import { TabsPage } from '../tabs/tabs';
import { WelcomeSlidesPage } from '../welcomeslides/welcomeslides';

/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({ selector: 'page-signup', templateUrl: 'signup.html' })
export class Signup {
  resposeData: any;
  userData = { "username": "", "password": "", "repeatpassword": "" };
  resp: any;
  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl: ToastController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  signup() {
    if (this.userData.password.length < 6) {
      this.presentToast("Passwort muss mindestens 6 Zeichen umfassen.");
      return -1;
    }
    if (this.userData.username.includes(":")) {
      this.presentToast("Username darf keinen Doppelpunkt enthalten.");
      return -2;
    }
    if (this.userData.username && this.userData.password) {
      if (this.userData.password == this.userData.repeatpassword) {
        //Api connections
        console.log("Signing in...");
        this.authService.postData(this.userData, "signup").then((result) => {
          this.resposeData = result;
          //console.log(JSON.stringify(this.resposeData));
          if (this.resposeData) {
            this.resp = JSON.stringify(this.resposeData.respData);
            if (this.resp == '"exists"') {
              this.presentToast("Ein anderer Nutzer besitzt bereits diesen Namen.");
              this.userData.username = "";
              this.userData.password = "";
              this.userData.repeatpassword = "";
              return -3;
            }
            console.log("Account created!");
            localStorage.setItem('userData', JSON.stringify(this.resposeData))
            this.navCtrl.push(WelcomeSlidesPage);
          }
          else {
            this.presentToast("Ein Fehler ist aufgetreten.");
          }
        }, (err) => {
          //Connection failed message
        });
      } else {
        this.presentToast("Bitte gib dein Passwort erneut ein.");
        this.userData.password = "";
        this.userData.repeatpassword = "";
      }
    }
    else {
      this.presentToast("Bitte fülle alle Felder aus.");
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
