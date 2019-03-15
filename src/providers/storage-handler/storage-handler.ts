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
}
