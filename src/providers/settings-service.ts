import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class SettingsService {
  private theme: BehaviorSubject<String>;
  currentTheme = localStorage.getItem("design");
  availableThemes: { className: string, prettyName: string }[];

  constructor() {
    this.theme = new BehaviorSubject('blue-theme');
    
    this.availableThemes = [
      { className: 'blue-theme', prettyName: 'Blue' },
      { className: 'black-theme', prettyName: 'Black' },
      { className: 'white-theme', prettyName: 'White' },
    ];
  }
  
  setTheme(val) {
    console.log("Changing to "+val+"-theme");
    this.theme.next(val + "-theme");
    this.currentTheme = val;
  }

  getThemeAsString() {
    return this.currentTheme;
  }

  getTheme() {
    return this.theme.asObservable();
  }
}
