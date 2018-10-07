import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
import { ContactPage } from '../contact/contact';

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
  ownname: any;
  item;
  items = [];

  userData =   { "username": "" };
  groupData =  { "name": "", "members": "" };

  responseData: any;
  resp: any;

  i: number;

  friends = [];
  members = [];
  member: any;
  memberstr: string = "";


  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  //searches for users in database
  getFriend() {
    if (this.userData.username) {
      this.authService.postData(this.userData, "getFriend").then((result) => {
        this.responseData = result;
        if (this.responseData.userData) {
          this.resp = JSON.stringify(this.responseData.userData);
          //parsing users in result
          this.friends = this.resp.split(":");
          this.friends[0] = this.friends[0].substring(1);
          this.friends.pop();

          for (this.i = 0; this.i < this.friends.length; this.i++) {
            this.items.push({ 'name': this.friends[this.i] });
          }
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

  //adds members and combines them to string
  addMember(item) {
    this.items = [];
    this.member = item.name;
    this.members.push(this.member);

    for (this.i = 0; this.i < this.members.length; this.i++) {
      this.memberstr = this.memberstr + this.members[this.i].toString() + ":";
    }
  }

  //actually creates new group in database
  createGroup() {
    this.ownname = this.storageH.getUsername();
    this.memberstr = this.memberstr + this.ownname.toString();
    this.groupData.members = this.memberstr;

    if (this.memberstr == this.ownname.toString() + ":" + this.ownname.toString() || this.memberstr == "") {
      this.presentToast("Füge der Gruppe mehr Mitglieder hinzu");
      return -1;
    }

    if (this.groupData.members) {
      this.authService.postData(this.groupData, "createGroup").then((result) => {
        this.responseData = result;
        if (this.responseData.groupData) {
          this.resp = JSON.stringify(this.responseData.groupData);
          this.presentToast('"' + this.groupData.name + '"' + " wurde hinzugefügt");
          this.navCtrl.pop();
          this.items = [];
          this.member = "";
          this.memberstr = "";
        }
        else {
          this.presentToast("Could not create group");
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

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
