import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any = this.user;
  pass: any = this.pass;

  constructor(public navCtrl: NavController, public sqlite: SQLite) {
  }

  getFunc() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {


        db.executeSql('create table danceMoves(name VARCHAR(32))', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));


      })
      .catch(e => alert(e));
  }
}
