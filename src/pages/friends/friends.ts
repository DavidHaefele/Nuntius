import { Component } from '@angular/core';
import { NavController, App, ToastController, MenuController } from 'ionic-angular';
import { Details } from '../details/details';
import { AuthService } from "../../providers/auth-service";
import { SplitPane } from '../../providers/split-pane';
import { AlertController } from 'ionic-angular';
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
import { AddContactToFriends } from '../addcontacttofriends/addcontacttofriends';
import { CreateGroup } from '../creategroup/creategroup';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  items = [];
  ownname = this.storageH.getUsername();
  own_id = this.storageH.getID();
  empty: String = "Hier sieht es noch leer aus :/";
  canFindFriends: Boolean = true;
  conversationList = [{ "conversationNr": "", "name": "", "ConvId": "", "isGroup": false, "lastMsg": "", "lastMsgAuthor": "" }];
  conversationNr = 0;

  constructor(public alerCtrl: AlertController, public nav: NavController, public app: App, public authService: AuthService, public toastCtrl: ToastController, public storageH: StorageHandlerProvider, public splitPane: SplitPane, public menu: MenuController) {

    this.menu.enable(true);
    this.splitPane.splitPaneState = true;
  }

  ionViewDidEnter() {
    this.load();
  }

  load() {
    this.getFriends();
    this.getGroups();
    this.sortItems();
    this.conversationNr = 0;
  }


  //TODO: Rework. This function seems to fail at its job
  sortItems() {
    /*this.items.sort(function (a, b) {
      var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });*/
    this.items.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }
  
  //load all contacts of the current user from the database
  getFriends() {
    console.log("You are logged in as " + this.storageH.getUsername());
    this.items = [];
    this.conversationList = [];
    var userData = { "user_id": "" };
    userData.user_id = this.storageH.getID().toString();
    if (userData) {
      this.authService.postData(userData, "getFriends").then((result) => {
        var response: any = result;

        //Add the found contacts to the local storage, a friendarray and to the visible items
        if (response) {
          for (let friend in response.friendlist) {
            this.empty = "";
            localStorage.setItem(friend, response.friendlist[friend]["username"] + ":" + response.friendlist[friend]["user_id"]);
            console.log(response.friendlist[friend]["username"] + " has the ConvNR " + this.conversationNr.toString());
            var nr = this.conversationList.push({ "conversationNr": this.conversationNr.toString(), "name": response.friendlist[friend]["username"], "ConvId": response.friendlist[friend]["user_id"], "isGroup": false, "lastMsg": "", "lastMsgAuthor": "" });
            this.conversationNr++;
            this.lastMsg(nr);
            this.items.push({ 'name': response.friendlist[friend]["username"], 'ConvId': response.friendlist[friend]["user_id"], "isGroup": false });
            this.sortItems();
          }
        } else {
          this.presentToast("Could not connect to the server");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast("Could not connect to the server");
      });
    }
    else {
      this.presentToast("Else");
    }

  }

  //load all groups of the current user from the database
  getGroups() {
    var userData = { "user_id": "" };
    userData.user_id = this.storageH.getID().toString();
    this.authService.postData(userData, "getGroups").then((result) => {
      var response: any = result;
      //Add the found groups to the local storage, a friendarray and to the visible items
      if (response.grouplist) {
        for (let group in response.grouplist) {
          this.empty = "";
          console.log(response.grouplist[group]["name"] + " has the ConvNR " + this.conversationNr.toString());
          localStorage.setItem(group, response.grouplist[group]["name"] + ":" + response.grouplist[group]["group_id"]);
          var nr = this.conversationList.push({ "conversationNr": this.conversationNr.toString(), "name": response.grouplist[group]["name"], "ConvId": response.grouplist[group]["group_id"], "isGroup": true, "lastMsg": "", "lastMsgAuthor": "" });
          this.conversationNr++;
          this.lastMsg(nr);
          this.items.push({ 'name': response.grouplist[group]["name"], "ConvId": response.grouplist[group]["group_id"], "isGroup": true });
          this.sortItems();
          //console.log("Found group with name " + response.grouplist[group]['name']);

        }
        //this.testvar[0] = "1";
      } else {
        this.presentToast("Could not connect to the server");
      }
    }, (err) => {
      //Connection failed message
      this.presentToast("Could not connect to the server");
    });
  }
  
  //delete a chosen group or contact
  deleteFriend(item, asAdmin) {
    console.log("Deleting " + item.ConvId + " from friend list");
    var userData = { "conv": "", "user_id": "", "isGroup": "", "asAdmin": false };
    userData.conv = this.storageH.getConv(item);
    userData.isGroup = item.isGroup;
    userData.user_id = this.own_id;
    console.log("DELETING " + userData.conv + ". WHICH IS GROUP " + userData.isGroup + ". AS " + userData.user_id + " ADMIN " + asAdmin);
    userData.asAdmin = asAdmin;
    console.log(item.ConvId);
    if (userData.conv) {
      this.authService.postData(userData, "deleteConv").then((result) => {
        var success: any = result;
        console.log("SUCCESS? |"+success.success+"|");
        if (success.success == "true") {
          console.log("Deleted " + item.username);
          for (let storage in localStorage) {
            if (localStorage.getItem(storage) == item.username + ":" + item.ConvId) {
              localStorage.removeItem(storage);
              console.log("Removed from localstorage: " + item.username + ":" + item.ConvId);
            }
          }
          this.load();
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

  //confirmation before deleting selected contact
  doConfirm(item) {
    console.log("Do Confirm");
    if (item.isGroup) {
      let userData = { "ownID": this.own_id, "groupID": item.ConvId };

      //check if the current user is the admin of the group
      this.authService.postData(userData, "isAdmin").then((result) => {
        var isAdmin: any = result;
        var message = "";
        console.log(isAdmin.returnValue);
        if (isAdmin.returnValue.toString() == "true") {
          message = 'Willst du diesen Chat wirklich entfernen? Dadurch wird diese Gruppe aufgelöst!';
        } else{
          message = 'Willst du diesen Chat wirklich entfernen? Dadurch verlässt du diese Gruppe!';
        }
        var asAdmin = isAdmin.returnValue;
        this.checkForApprovement(message, item, asAdmin);
      }, (err) => {
        //Connection failed message
        this.presentToast("Connection failed. Error: " + err);
      });
    } else {
      var message = "Willst du diesen Chat wirklich entfernen? Dadurch gehen alle Nachrichten verloren!";
      this.checkForApprovement(message, item, true);
    }
  }

  //send alert for confirmation of the deleting process
  checkForApprovement(message, item, asAdmin) {
    let confirm = this.alerCtrl.create({
      title: 'Bestätigung',
      message: message,
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
            if (!item.isGroup) {
              this.deleteFriend(item, asAdmin);
              this.presentToast("Kontakt erfolgreich entfernt");
            }

            else if (item.isGroup) {
              this.deleteFriend(item, asAdmin);
              this.presentToast("Gruppe erfolgreich entfernt");
            }
          }
        }
      ]
    });
    confirm.present()
  }

  //Diese Funktion schein nicht mehr von Nöten zu sein
  /*
  lastMessages(items) {
    this.lastMsgArr = [];
    this.itemNr = 0;
    for (var c = 0; c < items.length; c++) {
      this.lastMsg(items[c], this.itemNr);
      this.itemNr++;
    }
  }*/
  
  //loads the last message to display it under the account name
  lastMsg(nr) {
    var userData = { "conv": "", "nr": "" }
    var item = this.conversationList[nr - 1];
    userData.conv = this.storageH.getConv(item);
    userData.nr = this.conversationList[nr - 1].conversationNr;
    if (userData.conv) {
      console.log("Looking for last Message of " + userData.conv);
      this.authService.postData(userData, "lastMsg").then((result) => {
        var response: any = result;
        console.log(JSON.stringify(response));
        if (response.id) {
          console.log("Found lastMessage of " + userData.conv + ": " + response.id);
          this.conversationList[response.id] = { "conversationNr": this.conversationList[response.id].conversationNr, "name": this.conversationList[response.id].name, "ConvId": this.conversationList[response.id].ConvId, "isGroup": this.conversationList[response.id].isGroup, "lastMsg": response.message, "lastMsgAuthor": response.author };
        }
        else {
          this.conversationList[response.id] = { "conversationNr": this.conversationList[userData.nr].conversationNr, "name": this.conversationList[userData.nr].name, "ConvId": this.conversationList[userData.nr].ConvId, "isGroup": this.conversationList[userData.nr].isGroup, "lastMsg": "", "lastMsgAuthor": "" };
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

  //go to the details page of the specific item
  openNavDetailsPage(item) {
    this.nav.push(Details, { item: item });
  }

  //refresh the page every few seconds to keep the app synchronized with the database
  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    this.load();
    setTimeout(() => {
      console.log('Refreshing');
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
  addContactToFriends() {
    this.nav.push(AddContactToFriends);
  }

  createGroup() {
    this.nav.push(CreateGroup);
  }
}
