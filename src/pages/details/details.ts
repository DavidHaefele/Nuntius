import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-details',
    templateUrl: 'details.html',
})
export class Details {
    item;
    msgOut: String = this.msgOut;

    constructor(params: NavParams) {
        this.item = params.data.item;
    }

}


