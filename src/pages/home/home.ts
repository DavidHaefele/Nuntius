import { Component, ViewChild } from "@angular/core";
import { NavController, App, AlertController } from "ionic-angular";
import { AuthService } from "../../providers/auth-service";
//import { Common } from "../../providers/common";

@Component({ selector: "page-home", templateUrl: "home.html" })
export class HomePage {
  @ViewChild("updatebox") updatebox;
  public userDetails: any;
  public resposeData: any;
  public dataSet: any;
  userPostData = {
    user_id: "",
    token: "",
  };

  constructor(
    //public common: Common,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public app: App,
    public authService: AuthService
  ) {
    const data = JSON.parse(localStorage.getItem("userData"));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
  }

  converTime(time) {
    let a = new Date(time * 1000);
    return a;
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout() {
    //Api Token Logout

    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }
}
