import { Component } from '@angular/core';
import { NavController, App, ToastController, MenuController} from 'ionic-angular';
import { Details } from '../details/details';
import { AuthService } from "../../providers/auth-service";
import { SplitPane } from '../../providers/split-pane';
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
import { AddContactToFriends } from '../addcontacttofriends/addcontacttofriends';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  items = [];
  ownname = this.storageH.getUsername();
  own_id = this.storageH.getID();
  testvar = ["a","b"];
  empty: String = "";
  lastMsgArray = [];
  canFindFriends: Boolean = true;
  friendlist = [{"friendNr": "", "username": "", "user_id": ""}];

  constructor(public nav: NavController, public app: App, public authService: AuthService, public toastCtrl: ToastController, public storageH: StorageHandlerProvider, public splitPane: SplitPane, public menu: MenuController) {

    this.menu.enable(true);
    this.splitPane.splitPaneState = true;
  }

  ionViewDidEnter() {
    this.getFriends();
  }

  //UP TO DATE
  //load all friends
  getFriends() {
    console.log("You are logged in as " + this.storageH.getUsername());
    this.items = [];
    this.friendlist = [];
    var userData = { "user_id": "" };
    userData.user_id = this.storageH.getID().toString();
    console.log("Searching for friends of " + userData.user_id);
    if (userData) {
      this.authService.postData(userData, "getFriends").then((result) => {
        var response: any = result;
        console.log(JSON.stringify(response));
        if (response) {
          var a = 0;
          for (let friend in response.friendlist) {
            localStorage.setItem(friend, response.friendlist[friend]["username"] + ":" + response.friendlist[friend]["user_id"]);
            console.log(response.friendlist[friend]["username"] + " has the friendNR " + a.toString());
            this.friendlist.push({ "friendNr": a.toString(), "username": response.friendlist[friend]["username"], "user_id": response.friendlist[friend]["user_id"] });
            a++;
            this.items.push({ 'username': response.friendlist[friend]["username"], 'user_id': response.friendlist[friend]["user_id"] });
          }
          this.lastMsg();
          this.testvar[0] = "1";
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

  //UP TO DATE
  //delete a chosen friend
  deleteFriend(item) {
    console.log("Deleting " + item.user_id + " from friend list");
    var userData = { "conv": "", "user_id": "" };
    userData.conv = this.storageH.getConv(item);
    console.log(item.user_id);
    if (userData.conv) {
      //Api connections
      this.authService.postData(userData, "deleteFriend").then((result) => {
        var success:any = result;
        if (success.success == "true") {
          console.log("Deleted " + item.username);
          for (let storage in localStorage) {
            if (localStorage.getItem(storage) == item.username + ":" + item.user_id) {
              localStorage.removeItem(storage);
              console.log("Removed from localstorage: " + item.username + ":" + item.user_id);
            }
          }
          this.getFriends();
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

  //UP TO DATE
  //loads the last message to display it under the account name
  lastMsg() {
    this.lastMsgArray = [];
    var userData = {"conv":"", "nr": ""}
    for (var i = 0; i < this.friendlist.length; i++) {
      var item = {"user_id": this.friendlist[i].user_id};
      userData.conv = this.storageH.getConv(item);
      userData.nr = this.friendlist[i].friendNr;
      if (userData.conv) {
        console.log("Looking for last Message of " + userData.conv);
        this.authService.postData(userData, "lastMsg").then((result) => {
          var responseData: any = result;
          if (responseData) {
            console.log(responseData.nr);
            this.lastMsgArray[responseData.nr] = responseData.disMes.message;
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
  }

  openNavDetailsPage(item) {
    this.nav.push(Details, { item: item });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getFriends();

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
  addContactToFriends() {
    this.nav.push(AddContactToFriends);
  }
}
