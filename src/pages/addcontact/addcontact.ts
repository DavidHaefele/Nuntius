import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';

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
  resposeData: any;
  userData = { "username": "" };
  resp: any;
  friends = [];
  friend: any;
  ownname: any;

  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  getFriend() {
    if (this.userData.username) {
      this.authService.postData(this.userData, "getFriends").then((result) => {
        this.resposeData = result;
        if (this.resposeData.userData) {
          this.resp = JSON.stringify(this.resposeData.userData);
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
    this.friend = item.name;
    this.ownname = this.storageH.getUsername();


  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
