import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler';
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
  userData = { "username": "" };
  friends = [];
  friendnames = [];
  friend_ids = [];
  ownID = this.storageH.getID();

  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }
  
  //Returns a list of found accounts depending on the search
  getAvailableContacts() {
    this.items = [];
    if (this.userData.username) {
      console.log("getting contacts");
      this.authService.postData(this.userData, "getAvailableContacts").then((result) => {
        console.log(JSON.stringify(result));
        let responseData: any = result;
        if (responseData.contactlist) {
          for (let contact in responseData.contactlist) {
            if (responseData.contactlist[contact].user_id != this.ownID) {
              this.items.push({ 'username': responseData.contactlist[contact].username, 'user_id': responseData.contactlist[contact].user_id });
              this.friends.push({ "username": responseData.contactlist[contact].username, "user_id": responseData.contactlist[contact].user_id });
            }
          }
        }else {
          this.presentToast("User not found");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast("Could not connect to the server");
        console.log("Error: "+err);
      });
    }
    else {
      this.presentToast("Empty input field");
    }
  }
  
  //Add a chosen account to your friend list
  addContactAsFriend(item) {
    this.items = [];
    var friend_id = item.user_id;
    this.ownID = this.storageH.getID();
    let conv = [];
    conv.push({ "user_id": friend_id.toString() });
    conv.push({ "user_id": this.ownID.toString() });

    conv.sort(function (a, b) {
      var nameA = a.user_id.toLowerCase(), nameB = b.user_id.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });
    let userData = { "conv": "" };
    userData.conv = conv[0].user_id + ":" + conv[1].user_id;
    if (userData.conv) {
      this.authService.postData(userData, "addContactAsFriend").then((result) => {
        let response:any = result;
        if (response.success) {
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


