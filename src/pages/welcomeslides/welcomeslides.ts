import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
import { AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-welcomeslides',
  templateUrl: 'welcomeslides.html'
})
export class WelcomeSlidesPage {
  slides = [
    {
      title: "Willkommen bei Nuntius!",
      description: "Hier erwartet dich eine rießige Gemeindschaft. Finde heraus, wen du hier alles triffst!",
      image: "assets/img/ica-slidebox-img-1.png",
    },
    {
      title: "Was ist Nuntius?",
      description: "Nuntius ist ein Projekt zweier Studenten, welche die Vision haben, einen sicheren Instantmessanger zu erstellen, ohne die Befürchtung, dass andere mitlesen!",
      image: "assets/img/ica-slidebox-img-2.png",
    },
    {
      title: "Wie fange ich an?",
      description: "Benutze den hinzufügen Button und suche nach Freunden!",
      image: "assets/img/ica-slidebox-img-3.png",
    }
  ];
  resetDesign: Boolean = false;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public storageH: StorageHandlerProvider, private alertCtrl: AlertController) {

  }

  continue() {
    this.navCtrl.push(TabsPage);
  }
}
