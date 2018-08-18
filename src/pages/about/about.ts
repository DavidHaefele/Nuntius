import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  resetDesign: Boolean = false;
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public storageH: StorageHandlerProvider, private alertCtrl: AlertController) {

  }

  themeTab() {
    console.log("Theme PopUp");
    let alert = this.alertCtrl.create();
    alert.setTitle('Design');
    alert.addInput({
      type: 'radio',
      label: 'Blau',
      value: 'blue',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Weiß',
      value: 'white',
      checked: false
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log('Radio data:', data);
        if (this.storageH.design != data) {
          this.storageH.design = data;
          this.resetDesign = true;
        }
      }
    });

    alert.present();
  }

  checkCurrentDesign() {
    this.presentToast("Current design is " + this.storageH.design.toString());
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000
    });
    toast.present();
  }

}
