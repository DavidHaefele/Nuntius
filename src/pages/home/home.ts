import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any = this.user;
  pass: any = this.pass;

  constructor(public navCtrl: NavController) {
  }

  getFunc() {
  }
}
