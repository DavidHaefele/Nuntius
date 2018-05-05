import { Component} from '@angular/core';
import { NavController, NavParams, App, ToastController } from 'ionic-angular';
import { Details } from '../details/details';
import { AuthService } from "../../providers/auth-service";

@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html'
})
export class ContactPage {
  responseData: any;
  userData = { "username": "Urmel"};
  items = [];
  resp: any;

  constructor(public nav: NavController, public app: App, public authService: AuthService, public toastCtrl: ToastController) {

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
    this.presentToast("Kein Bock, alta");
  }

  getContacts() {
    this.presentToast("Tescht");
    if (this.userData.username) {
      this.presentToast("Hsdasdfsf");
      this.authService.postData(this.userData, "getContacts").then((result) => {
        this.presentToast("Hi");
        this.responseData = result;
        console.log(this.responseData);
        if (this.responseData.userData) {
          //localStorage.setItem('userData', JSON.stringify(this.resposeData))
          this.presentToast("" + this.responseData.userData);
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
      duration: 2000
    });
    toast.present();
  }
}
