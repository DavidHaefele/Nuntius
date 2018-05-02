import { Component} from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { Details } from '../details/details';
import { AuthService } from "../../providers/auth-service";

@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html'
})
export class ContactPage {
    items = [];

  constructor(public nav: NavController, public app: App, public authService: AuthService) {

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
}
