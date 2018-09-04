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
  selector: 'page-addcontact',
  templateUrl: 'addcontact.html',
})
export class AddContact {

  items = [];
  i: number;
  responseData: any;
  userData = { "username": "" };
  resp: any;
  friends = [];

  friend: any;
  ownname: any;
  conv = [];
  convstr: any;
  responseDataC: any;
  respC: any;
  userDataC = {"conv": ""};

  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  getFriend() {
    if (this.userData.username) {
      this.authService.postData(this.userData, "getFriend").then((result) => {
        this.responseData = result;
        if (this.responseData.userData) {
          this.resp = JSON.stringify(this.responseData.userData);
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

  addFriend(item) {
    this.items = [];
    this.friend = item.name;
    this.ownname = this.storageH.getUsername();

    this.conv.push({"username": this.friend.toString() });
    this.conv.push({"username": this.ownname.toString() });

    this.conv.sort(function (a, b) {
      var nameA = a.username.toLowerCase(), nameB = b.username.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });

    this.convstr = this.conv[0].username + ":" + this.conv[1].username;
    this.userDataC.conv = this.convstr;


    if (this.userDataC.conv) {
      this.authService.postData(this.userDataC, "addConv").then((result) => {
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


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
