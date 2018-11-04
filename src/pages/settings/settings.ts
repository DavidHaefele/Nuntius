import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { StorageHandlerProvider } from '../../providers/storage-handler';
import { AlertController } from 'ionic-angular';
import { SettingsService } from '../../providers/settings-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {
  resetDesign: Boolean = false;
  design = this.getThemeAsString();
  selected: String;
  availableThemes: { className: string, prettyName: string }[];
  constructor(public navCtrl: NavController, private settings: SettingsService, public toastCtrl: ToastController, public storageH: StorageHandlerProvider, private alertCtrl: AlertController) {
    this.selected = localStorage.getItem("design");
    this.settings.getTheme().subscribe(val => this.selected = val);
  }

  //Alert with multiple themes to choose from
  themeTab() {
    const colors = ['blue', 'white', 'black'];

    console.log("Theme PopUp");
    let alert = this.alertCtrl.create();
    alert.setTitle('Design');
    colors.forEach(color => {
      alert.addInput({
        type: 'radio',
        label: color,
        value: color.toLowerCase(),
        checked: localStorage.getItem("design") == color.toLowerCase()
      });
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log('Radio data:', data);
        if (localStorage.getItem("design") != data) {
          console.log("setting "+data+ " as deisgn")
          this.setTheme(data);
          localStorage.setItem("design", data);
          this.design = this.getThemeAsString();
          this.resetDesign = true;
        }
      }
    });

    alert.present();
  }

  getTheme() {
    return this.settings.getTheme();
  }

  getThemeAsString() {
    return this.settings.getThemeAsString();
  }

  setTheme(e) {
    this.settings.setTheme(e);
  }

  //name self explanatory
  checkCurrentDesign() {
    this.presentToast("Current design is " + localStorage.getItem("design").toString());
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000
    });
    toast.present();
  }

}
