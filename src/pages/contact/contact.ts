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
  item;
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
  canFindContacts: Boolean = true;
  Convarr = [];
  conv: String;
  responseDataC: any;
  userDataC = {"conv": "" };
  respC: any;

  constructor(public nav: NavController, public app: App, public authService: AuthService, public toastCtrl: ToastController, public storageH: StorageHandlerProvider, public splitPane: SplitPane, public menu: MenuController) {

    this.menu.enable(true);
    this.splitPane.splitPaneState = true;
  }

  ionViewDidEnter() {
    this.getContacts();
  }

  getContacts() {
    this.finalcontacts = [];
    this.Contacts = [];
    this.items = [];
    this.userData.username = this.storageH.getUsername().toString();
    if (this.userData.username) {
      this.authService.postData(this.userData, "getContacts").then((result) => {
        this.responseData = result;

        if (this.responseData.userData) {
          this.canFindContacts = true;
          if (!this.canFindContacts) {
            this.empty = "Hier sieht's noch leer aus :/";
          } else {
            this.empty = "";
          }
          //this.presentToast(JSON.stringify(this.responseData.userData));
          this.resp = JSON.stringify(this.responseData.userData);
          this.Contacts = this.resp.split(":");
          this.Contacts[0] = this.Contacts[0].substring(1);
          this.Contacts.pop();

          for (this.x = 0; this.x < this.Contacts.length; this.x++) {

            if (this.Contacts[this.x] != this.ownname) {
              this.finalcontacts[this.i] = this.Contacts[this.x];
              this.i++;
            }
          }
          this.i = 0;
          for (this.b = 0; this.b < this.finalcontacts.length; this.b++) {
            this.items.push({ 'name': this.finalcontacts[this.b] });
          }
        } else {
          this.canFindContacts = false;
          if (!this.canFindContacts) {
            this.empty = "Hier sieht's noch leer aus :/";
          } else {
            this.empty = "";
          }
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


  deleteContact(item) {
    this.getConv(item);
    if (this.userDataC.conv) {
      //Api connections
      console.log("The conv string is: |"+this.userDataC.conv+"| here.");
      this.authService.postData(this.userDataC, "deleteContact").then((result) => {
        this.responseDataC = result;
        console.log(this.responseDataC.disMes);
        if (this.responseDataC) {
          this.respC = JSON.stringify(this.responseDataC.disMes);
          if (this.respC) {
            console.log("Deleted " + this.respC);
            this.getContacts();
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

  getConv(item) {
    this.Convarr = [];
    this.Convarr.push({ "username": this.ownname.toString() });
    this.Convarr.push({ "username": item.name.toString() });
    this.Convarr.sort(function (a, b) {
      var nameA = a.username.toLowerCase(), nameB = b.username.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });


    this.userDataC.conv = (this.Convarr[0].username + ":" + this.Convarr[1].username).toString();
  }
}
