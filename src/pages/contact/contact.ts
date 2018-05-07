import { Component } from '@angular/core';
import { NavController, App, ToastController, MenuController } from 'ionic-angular';
import { Details } from '../details/details';
import { AuthService } from "../../providers/auth-service";
import { SplitPane } from '../../providers/split-pane';
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
import { AddContact } from '../addcontact/addcontact';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  responseData: any;
  userData = { "username": "" };
  items = [];
  Contacts = [];
  finalcontacts = [];
  resp: any;
  i: number = 0;
  b: number;
  x: number;
  ownname = this.storageH.getUsername();
  empty: String;
  friends = [];
  friend: any;

  constructor(public nav: NavController, public app: App, public authService: AuthService, public toastCtrl: ToastController, public storageH: StorageHandlerProvider, public splitPane: SplitPane, public menu: MenuController) {

    this.menu.enable(true);
    this.splitPane.splitPaneState = true;
    this.getContacts();

  }

  getContacts() {
    this.items = [];
    this.userData.username = this.storageH.getUsername().toString();
    if (this.userData.username) {
      this.authService.postData(this.userData, "getContacts").then((result) => {
        this.responseData = result;

        if (this.responseData.userData) {
          //this.presentToast(JSON.stringify(this.responseData.userData));
          this.resp = JSON.stringify(this.responseData.userData);
          console.log(this.resp);
          this.Contacts = this.resp.split(":");
          this.Contacts[0] = this.Contacts[0].substring(1);
          console.log(this.Contacts);
          this.Contacts.pop();
          console.log(this.Contacts);

          for (this.x = 0; this.x < this.Contacts.length; this.x++) {

            if (this.Contacts[this.x] != this.ownname) {
              console.log(this.Contacts[this.x] + " entspricht nicht " + this.ownname);
              this.finalcontacts[this.i] = this.Contacts[this.x];
              this.i++;
            } else {
              console.log(this.Contacts[this.x] + " entspricht " + this.ownname);
            }
          }

          for (this.b = 0; this.b < this.finalcontacts.length; this.b++) {
            this.items.push({ 'name': this.finalcontacts[this.b] });
          }
        }
        else {
          this.empty = "It looks empty here :/";
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

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getContacts();

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000
    });
    toast.present();
  }

  addContact() {
    this.nav.push(AddContact);
  }
}
