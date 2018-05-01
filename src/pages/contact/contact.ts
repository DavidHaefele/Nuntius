import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Details } from '../details/details';

@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html'
})
export class ContactPage {
    items = [];

    constructor(public nav: NavController) {
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
}
