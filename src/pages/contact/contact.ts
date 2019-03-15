import { Component } from '@angular/core';
import { NavController, App, ToastController, MenuController } from 'ionic-angular';
import { Details } from '../details/details';
import { AuthService } from "../../providers/auth-service";
import { SplitPane } from '../../providers/split-pane';
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
import { AlertController } from 'ionic-angular';
import { AddContact } from '../addcontact/addcontact';
import { CreateGroup } from '../creategroup/creategroup';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  ownname = this.storageH.getUsername();
  //contacts
  item;
  items = [];
  //groups
  item2;
  items2 = [];

  //data to be sent to the server
  userData       = { "username": "" };
  userDataC      = { "conv": "", "nr": "" };
  userDataDelete = { "conv": "", "type": "" };

  //server response
  responseData:  any;
  resp:          any;
  respGroups:    any;
  respMessage:   any;
  respAuthor:    any;

  //iterators
  i: number = 0;
  b: number;
  x: number;
  c: number;
  itemNr: number;

  Convarr = [];
  conv: String;

  //contact lists
  Contacts      = [];
  finalcontacts = [];
  friends       = [];
  friend: any;
  //group lists and lists of last messages
  Groups        = [];
  lastMsgArr    = [];
  lastMsgArr2   = [];
  lastAuthorArr = [];

  //handling non-existent contacts and groups
  canFindContacts: Boolean = true;
  empty:   String;
  empty2:  String;



  constructor(public nav: NavController, public app: App, public authService: AuthService, public toastCtrl: ToastController, public storageH: StorageHandlerProvider, public splitPane: SplitPane, public menu: MenuController, public alerCtrl: AlertController) {

    this.menu.enable(true);
    this.splitPane.splitPaneState = true;
  }

  ionViewDidEnter() {
    this.getContacts();
  }

  //gets lists of single contacts and groups
  getContacts() {
    this.finalcontacts = [];
    this.Contacts = [];
    this.items = [];
    this.Groups = [];
    this.items2 = [];
    this.userData.username = this.storageH.getUsername().toString();
    if (this.userData.username) {
      this.authService.postData(this.userData, "getContacts").then((result) => {
        this.responseData = result;

        this.canFindContacts = true;
        if (this.responseData.userData == "empty") {
          this.empty = "Hier sieht's noch leer aus :/";
        }
        else {
          this.empty = "";
        }

        if (this.responseData.groupData == "empty") {
          this.empty2 = "Hier sieht's noch leer aus :/";
        }
        else {
          this.empty2 = "";
        }

        if (this.responseData.userData || this.responseData.groupData) {
          //parses strings lists and removes quotation marks
          this.resp = JSON.stringify(this.responseData.userData);
          this.Contacts = this.resp.split(":");
          this.Contacts[0] = this.Contacts[0].substring(1);
          this.Contacts.pop();

          this.respGroups = JSON.stringify(this.responseData.groupData);
          this.Groups = this.respGroups.split(":");
          this.Groups[0] = this.Groups[0].substring(1);
          this.Groups.pop();

          for (this.b = 0; this.b < this.Groups.length; this.b++) {
            this.items2.push({ 'name': this.Groups[this.b], 'type': "group" });
          }

          //only adds other users to contact list
          for (this.x = 0; this.x < this.Contacts.length; this.x++) {
            if (this.Contacts[this.x] != this.ownname) {
              this.finalcontacts[this.i] = this.Contacts[this.x];
              this.i++;
            }
          }
          this.i = 0;
          for (this.b = 0; this.b < this.finalcontacts.length; this.b++) {
            this.items.push({ 'name': this.finalcontacts[this.b], 'type': "contact"  });
          }
          this.lastMessages(this.items, "contact");
          this.lastMessages(this.items2, "group");

        } else {
          //else statement
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


  //confirmation before deleting selected contact
  doConfirm(item, type) {
    let confirm = this.alerCtrl.create({
      title: 'Bestätigung',
      message: 'Willst du diesen Chat wirklich entfernen?',
      buttons: [
        {
          text: 'Nein',
          handler: () => {
            console.log('Disagree clicked');
            this.presentToast("Löschvorgang abgebrochen");
          }
        },
        {
          text: 'Ja',
          handler: () => {
            console.log('Agree clicked');
            if (type == "contact") {
              this.deleteContact(item, "contact");
              this.presentToast("Kontakt erfolgreich entfernt");
            }

            else if (type == "group") {
              this.deleteContact(item, "group");
              this.presentToast("Gruppe erfolgreich entfernt");
            }
          }
        }
      ]
    });
    confirm.present()
  }

  //removing conversation from database
  deleteContact(item, type) {
    if (type == "contact") {
      this.userDataDelete.type = "contact";
      this.getConv(item);
    }

    else if (type == "group") {
      this.userDataDelete.type = "group";
      this.userDataDelete.conv = item.name;
    }
    
    if (this.userDataDelete.conv) {
      //Api connections
      this.authService.postData(this.userDataDelete, "deleteContact").then((result) => {
        this.responseData = result;
        console.log(this.responseData.disMes);
        if (this.responseData) {
          this.resp = JSON.stringify(this.responseData.disMes);
          if (this.resp) {
            //reloads contact list
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

  lastMessages(items, type) {
    this.lastMsgArr =    [];
    this.lastMsgArr2 =   [];
    this.lastAuthorArr = [];
    this.itemNr = 0;
    for (this.c = 0; this.c < items.length; this.c++) {
      this.lastMsg(items[this.c], this.itemNr, type);
      this.itemNr++;
    }
  }


  lastMsg(item, itemNr, type) {
    if (type == "contact") {
      this.getConv(item);
    }

    else if (type == "group") {
      this.userDataC.conv = item.name;
    }
    
    this.userDataC.nr = this.itemNr.toString();
    if (this.userDataC.conv) {
      console.log("Looking for last Message of " + this.userDataC.conv);
      this.authService.postData(this.userDataC, "lastMsg").then((result) => {
        this.responseData = result;

        if (this.responseData.disMes.message) {
          //gets last message and its author
          this.respMessage = JSON.stringify(this.responseData.disMes.message);
          this.respAuthor = JSON.stringify(this.responseData.author.author);

          if (this.respMessage) {
            console.log("respMessage/Author: " + this.respMessage + ", " + this.respAuthor);
            
            if (type == "contact") {
              this.respMessage = this.respMessage.replace('"', '');
              this.respMessage = this.respMessage.replace('"', '');
              this.lastMsgArr[this.responseData.nr] = this.respMessage;
            }

            else if (type == "group") {
              this.respAuthor = this.respAuthor.replace('"', '');
              this.respAuthor = this.respAuthor.replace('"', '');
              this.lastMsgArr2[this.responseData.nr] = this.respMessage;
              this.lastAuthorArr[this.responseData.nr] = this.respAuthor + ": ";
            }
            
          }
        }
        else {
          this.lastMsgArr2 = [""];
          this.lastAuthorArr = [""];
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

  createGroup() {
    this.nav.push(CreateGroup);
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
    this.userDataDelete.conv = this.userDataC.conv;
  }
}
