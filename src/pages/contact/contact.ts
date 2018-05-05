import { Component} from '@angular/core';
import { NavController, NavParams, App, ToastController } from 'ionic-angular';
import { Details } from '../details/details';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';

@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html'
})
export class ContactPage {
  responseData: any;
  userData = { "username": "" };
  user: String;
  items = [];
  resp: any;
  contacts = [];

  constructor(public nav: NavController, public app: App, public authService: AuthService, public toastCtrl: ToastController, public storageH: StorageHandlerProvider) {

        this.items = [
            {
                'name': 'Max',
                'description': 'A default guy.',
                'img': '../assets/icon/chat.svg.png',
                'msgIn': 'Hello, how are you?'
            },
            {
                'name': 'Lisa',
                'description': 'She has a common girls name.',
                'img': '../assets/icon/chat.svg.png',
                'msgIn': 'Can we meet in the afternoon?'
            },
            {
                'name': 'David',
                'description': 'Has the best name ever!',
                'img': '../assets/icon/chat.svg.png',
                'msgIn': 'Yes, i am bored too...'
            }
        ]
        
  }

  getContacts() {
    this.userData.username = this.storageH.getUsername().toString();
    if (this.userData.username) {
      this.authService.postData(this.userData, "getContacts").then((result) => {
        this.responseData = result;
        console.log(this.responseData);
        if (this.responseData.userData) {
          this.presentToast(JSON.stringify(this.responseData.userData));
          this.resp = JSON.stringify(this.responseData.userData);

        }
        else {
          this.presentToast("Not found");
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

    openNavDetailsPage(item) {
        this.nav.push(Details, { item: item });
    }

  converTime(time) {
    let a = new Date(time * 1000);
    return a;
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout() {
    //Api Token Logout

    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000
    });
    toast.present();
  }
}
