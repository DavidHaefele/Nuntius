import { Injectable } from '@angular/core';

/*
  Generated class for the StorageHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageHandlerProvider {
  name: any;
  usr: any;
  data: String = "";

  constructor() {

  }

  getUsername() {
    this.data = localStorage.getItem('userData');
    this.name = this.data.split(",");
    this.name = this.name[1].split("\"");
    this.usr = this.name[3].split(",");
    return this.usr;
  }

}
