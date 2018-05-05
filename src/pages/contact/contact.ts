import { Component} from '@angular/core';
import { NavController, NavParams, App, ToastController } from 'ionic-angular';
import { Details } from '../details/details';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';

@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html'
})
export class ContactPage {
  responseData: any;
  userData = { "username": "" };
  items = [];
  Contactarray = [];
  Contacts = [];
  resp: any;
  i: number;
  b: number;
  arraylength: number;
  ownname = this.storageH.getUsername();

  constructor(public nav: NavController, public app: App, public authService: AuthService, public toastCtrl: ToastController, public storageH: StorageHandlerProvider) {
        
    this.getContacts();
        
  }

  getContacts() {
    this.userData.username = this.storageH.getUsername().toString();
    if (this.userData.username) {
      this.authService.postData(this.userData, "getContacts").then((result) => {
        this.responseData = result;
        console.log(this.responseData);
        if (this.responseData.userData) {
          //this.presentToast(JSON.stringify(this.responseData.userData));
          this.resp = JSON.stringify(this.responseData.userData);
          this.Contacts = this.resp.split(":");
          this.Contacts[0] = this.Contacts[0].substring(1);
          this.Contacts.pop();
          this.arraylength = this.Contacts.length;
          this.i = 0;
          while (this.Contacts.length != this.arraylength / 2) {
        
            if (this.Contacts[this.i] == this.ownname) {
              this.Contacts.splice(this.i, 1);
            }
            this.i++;
          }
          this.Contactarray = this.Contacts;
          for (this.b = 0; this.b < this.Contactarray.length; this.b++) {
            this.items.push({ 'name': this.Contactarray[this.b] });
          }
        }
        else {
          this.presentToast("Not found");
        }

      }, (err) => {
        //Connection failed message
        this.presentToast(err);
      });
    }
    else {
      this.presentToast("Else");
    }
  }

    openNavDetailsPage(item) {
        this.nav.push(Details, { item: item });
    }

  converTime(time) {
    let a = new Date(time * 1000);
    return a;
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout() {
    //Api Token Logout

    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000
    });
    toast.present();
  }
}
