import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
<<<<<<< HEAD
import { SQLite } from '@ionic-native/sqlite';
=======
>>>>>>> 40a5b72b4c3417ca3ab81d6a34b0825e08dfd730

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any = this.user;
  pass: any = this.pass;

<<<<<<< HEAD
  constructor(public navCtrl: NavController, public sqlite: SQLite) {
=======
  constructor(public navCtrl: NavController) {

>>>>>>> 40a5b72b4c3417ca3ab81d6a34b0825e08dfd730
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
