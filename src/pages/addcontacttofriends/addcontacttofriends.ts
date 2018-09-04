import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
import { FriendsPage } from '../friends/friends';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-addcontacttofriends',
  templateUrl: 'addcontacttofriends.html',
})
export class AddContactToFriends {

  items = [];
  responseData: any;
  userData = { "username": "" };
  resp: any;
  friendnames = [];
  friend_ids = [];
  friend_id: any;
  own_id: any;
  conv = [];
  convstr: any;
  responseDataC: any;
  respC: any;
  userDataC = { "conv": "" };

  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }
  
  //Returns a list of found accounts depending on the search
  getAvailableContacts() {
    if (this.userData.username) {
      this.authService.postData(this.userData, "getAvailableContacts").then((result) => {
        this.responseData = result;
        if (this.responseData.userData) {
          this.resp = JSON.stringify(this.responseData.userData);
          console.log("All available contacts found: " + this.resp);
          var friends = this.resp.split(":");
          friends[0] = friends[0].substring(1);
          friends.pop();
          for (var i = 0; i < friends.length; i++) {
            console.log(friends[i]);
            if (i % 2 == 0) {
              this.items.push({ 'name': friends[i], 'user_id': friends[i+1]});
            }
          }
            this.friendnames = [];
            for (var i = 0; i < this.items.length; ++i)
            this.friendnames.push(this.items[i]["name"]);
            console.log(this.friendnames);
            this.friend_ids = [];
            for (var i = 0; i < this.items.length; ++i)
            this.friend_ids.push(this.items[i]["name"]);
            console.log(this.friend_ids);
        }
        else {
          this.presentToast("User not found");
        }
      }, (err) => {
        //Connection failed message
      });
    }
    else {
      this.presentToast("Empty input field");
    }

  }

  //Add a chosen account to your friend list
  addContactAsFriend(item) {
    this.items = [];
    this.friend_id = item.user_id;
    this.own_id = this.storageH.getID();
    this.conv.push({"user_id": this.friend_id.toString() });
    this.conv.push({"user_id": this.own_id.toString() });

    this.conv.sort(function (a, b) {
      var nameA = a.user_id.toLowerCase(), nameB = b.user_id.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });

    this.convstr = this.conv[0].user_id + ":" + this.conv[1].user_id;
    this.userDataC.conv = this.convstr;
    
    if (this.userDataC.conv) {
      this.authService.postData(this.userDataC, "addContactAsFriend").then((result) => {
        this.responseDataC = result;
        if (this.responseDataC.userDataC) {
          this.respC = JSON.stringify(this.responseDataC.userDataC);
          this.presentToast(item.name + " hinzugefügt");
          this.navCtrl.pop();
          this.items = [];
        }
        else {
          this.presentToast("Could not add friend");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast(err);
      });
    }
    else {
      this.presentToast("Bad Error");
    }

  }
  /* NOT NEEDED - still leaving it in for later usage. Takes a name and returns the coherent ID.
  getID(name: any) {
    console.log("checking the ID of " + name);
    this.authService.postData(name, "getID").then((result) => {
      var responseDataID = result;
      if (responseDataID) {
        var split_array = JSON.stringify(responseDataID).split("\"");
        var friendid = split_array[5];
        this.friend_id = friendid;
        console.log(friendid);
        return friendid;
      }
      }, (err) => {
        //Connection failed message
        this.presentToast(err);
        return -1;
      });
  }*/

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}


