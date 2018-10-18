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
  selector: 'page-creategroup',
  templateUrl: 'creategroup.html',
})
export class CreateGroup {
  ownID = this.storageH.getID();
  groupData = { "name": "", "members": "", "admin": ""+this.ownID.toString() };
  userData = { "username": "" };
  item;
  items = [];
  friendnames = [];
  friend_ids = [];
  members = [];
  /*

  
  responseData: any;
  resp: any;
  

  friends = [];
  
  */

  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  //REWORK NEEDED (JSON.stringify is outdated) --------------------- check getGroups() in friends.ts
  //searches for users in database
  getFriend() {
    this.items = [];
    if (this.userData.username) {
      this.authService.postData(this.userData, "getAvailableContacts").then((result) => {
        var responseData : any = result;
        if (responseData.userData) {
          let resp = JSON.stringify(responseData.userData);
          console.log("All available contacts found: " + resp);
          var friends = resp.split(":");
          friends[0] = friends[0].substring(1);
          friends.pop();
          for (var i = 0; i < friends.length; i++) {
            if (friends[i + 1] != this.ownID) {
              console.log(friends[i]);
              if (i % 2 == 0) {
                this.items.push({ 'name': friends[i], 'user_id': friends[i + 1] });
              }
            }
          }
          this.friendnames = [];
          for (var k = 0; k < this.items.length; ++k)
            this.friendnames.push(this.items[k]["name"]);
          console.log(this.friendnames);
          this.friend_ids = [];
          for (var l = 0; l < this.items.length; ++l)
            this.friend_ids.push(this.items[l]["user_id"]);
          console.log(this.friend_ids);
        }
        else {
          this.presentToast("User not found");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast("Could not connect to the server");
      });
    }
    else {
      this.presentToast("Empty input field");
    }
    console.log("Members in Group " + (1 + this.members.length));
  }

  removeFriend(item) {
    var friendID = item["user_id"];
    var i = 0;
    for (let member of this.members) {
      if (item == member) {
        this.members.splice(i, 1);
      }
      i++;
    }
    console.log("Members in Group " + (1 + this.members.length));
  }
  
  //adds members and combines them to string
  addMember(item) {
    this.items = [];
    let member = ({ 'name': item.name, 'user_id': item.user_id });
    this.members.push(member);
    console.log("Members in Group " + (1 + this.members.length));
  }
  
  //actually creates new group in database
  createGroup() {
    console.log("Trying to add group with name " + this.groupData.name + ". And admin : " + this.groupData.admin);
    if (this.members.length < 2) {
      this.presentToast("Füge der Gruppe mehr Mitglieder hinzu");
      return -1;
    }
    let memberString = this.ownID + ":";
    let sortetMembers = this.members.sort(function (a, b) {
      var nameA = a.user_id.toLowerCase(), nameB = b.user_id.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });
    for (var i = 0; i < sortetMembers.length; i++) {
      if (i != this.members.length - 1) {
        memberString = memberString + sortetMembers[i]['user_id'].toString() + ":";
      } else {
        memberString = memberString + sortetMembers[i]['user_id'].toString();
      }
    }
    console.log("MemberString is " + memberString);
    this.groupData.members = memberString;
    
    if (this.groupData.members) {
      if(this.groupData.name != "")
      {
        this.authService.postData(this.groupData, "createGroup").then((result) => {
          let responseData: any = result;
          if (responseData.success) {
            this.presentToast('"' + this.groupData.name + '"' + " wurde hinzugefügt");
            this.navCtrl.pop();
            this.items = [];
            this.members = [];
          }
          else {
            this.presentToast("Could not create group");
          }
        }, (err) => {
          //Connection failed message
          this.presentToast(err);
        });
      }else {
        this.presentToast("Please set a name for your group");
      }
    }
    else {
      this.presentToast("Bad Error");
    }
    console.log("Create-group-process finished");
  }
  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
