import { Injectable } from '@angular/core';

/*
  Generated class for the StorageHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageHandlerProvider {
  name: any;
  user_id: any;
  design: String = "blue";
  data: String = "";

  constructor() {

  }

  getUsername() {
    this.data = localStorage.getItem('userData');
    this.name = this.data.split("\"");
    this.user_id = this.name[5];
    this.name = this.name[9];
    return this.name;
  }

  getID() {
    this.data = localStorage.getItem('userData');
    this.name = this.data.split("\"");
    this.user_id = this.name[5];
    this.name = this.name[9];
    return this.user_id;
  }

  getConv(item) {
    var Convarr = [];
    Convarr.push({ "username": this.user_id.toString() });
    Convarr.push({ "username": item.user_id.toString() });
    //console.log("Conv is "+ this.Convarr);
    Convarr.sort(function (a, b) {
      var nameA = a.username.toLowerCase(), nameB = b.username.toLowerCase();
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    });

    return (Convarr[0].username + ":" + Convarr[1].username).toString();
  }
}
