import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: any = this.user;
  pass: any = this.pass;
  dataset: any = this.dataset;
  testdata: string = "";
  querystring: any = "Changeme";
  stringtest: any = "Moje";

  constructor(public navCtrl: NavController, public http: Http) {
  }

  getFunc() {
    this.testdata = "Function executed";

    this.querystring = {
      phpdata: (): Promise<any> => {
        return this.http.get("./home.php").map(stringtest => {
          return stringtest.json();
        }).toPromise();
      }
    }
  }
}
