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
    penis: any = 30;

    constructor(public navCtrl: NavController, public http: Http) {
    }

    getFunc() {
        this.http.get('./home.php').map(res => res.json()).subscribe(data => {
            console.log(data);
            this.dataset = data;
        });
    }
}
