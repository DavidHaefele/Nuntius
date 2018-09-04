import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, App } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import { StorageHandlerProvider } from '../../providers/storage-handler/storage-handler';
//import { Content } from 'ionic-angular';
//import { empty } from 'rxjs/Observer';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class Details {
  @ViewChild('content') content: any;
  @ViewChild('scroll') scroll: any;
  item;
  msgOut: any = { "conv": "", "message": "", "author": "" };
  messages = [];
  dimensions: any;
  currentScrollPosition = 0;
  id: any = 1;
  reload: Boolean = false;
  ContentHeight: any;
  displayedMessages = 0;

  scrollToBottom() {
    this.content.scrollToBottom();
  }

  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  scrollTo(x: number,
    y: number,
    duration: number): void {
    this.content.scrollTo(x, y, duration);
  }

  contentHeight() {
    this.dimensions = this.content.getContentDimensions();
    this.ContentHeight = this.dimensions.scrollHeight - 591;
    this.currentScrollPosition = this.dimensions.scrollHeight - this.dimensions.scrollTop - 591;
    console.log("CONTENT HEIGHT: " + this.ContentHeight + " YOUR SCROLL HIGHT : " + this.currentScrollPosition);
  }

  contentTop() {
    this.dimensions = this.content.getContentDimensions();
  }

  constructor(public navCtrl: NavController, params: NavParams, public app: App, private authService: AuthService, private toastCtrl: ToastController, public storageH: StorageHandlerProvider, public localNotifications: LocalNotifications) {
    this.item = params.data.item;
    this.displayMessages();
    this.id = setInterval(() => {
      this.contentHeight();
      this.deltaMsg();
      if (this.reload == true) {
        console.log("New message!");
        this.displayMessages();
        this.reload = false;
      }
    }, 500);
  }


  //scroll to the bottom at loading
  ionViewDidEnter() {
    this.contentTop();
    this.scrollToBottom();
    this.sleep(100).then(() => {
      this.scrollTo(0, this.ContentHeight, 1);
      this.sleep(100).then(() => {
        this.scrollTo(0, 100, 1);
        this.sleep(100).then(() => {
          this.scrollTo(0, 0, 1);
        });
      });
    });
    this.contentTop();
    //var scrollPos0 = this.dimensions.scrollHeight - this.dimensions.scrollTop + 1000;

    /*var id2 = setInterval(() => {
      this.contentTop();
      //var scrollPos = this.dimensions.scrollHeight - this.dimensions.scrollTop;
      this.contentHeight();
    }, 500);*/
  }

  ionViewWillLeave() {
    clearInterval(this.id);
  }

  //UP TO DATE
  //display all messages between the accounts
  displayMessages() {
    this.displayedMessages = 0;
    var userData = { "conv": "" };
    this.messages = []; 
    userData.conv = this.storageH.getConv(this.item);
    console.log("checking for messages between " + userData.conv);
    if (userData.conv) {
      //Api connections
      this.authService.postData(userData, "displayMessages").then((result) => {
        var response: any = result;
        if (result) {
          for (let message in response.messagelist) {
            if (response.messagelist[message]["author"] == this.storageH.getID().toString()) {
              this.displayedMessages++;
              this.messages.push({ "message": response.messagelist[message]["message"], "showown": true });
            }
            else {
              this.displayedMessages++;
              this.messages.push({ "message": response.messagelist[message]["message"], "showown": false });
            }
          }
        }

        else {
          console.log("Not found!");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast("Connection failed. Error: " + err);
      });
    }
    else {
      this.presentToast("Could not load messages. Try again!");
    }
  }
  //UP TO DATE
  //send a message to the other account
  msgSend() {
    this.msgOut.conv = "";
    this.msgOut.author = "";
    this.msgOut.conv = this.storageH.getConv(this.item);
    this.msgOut.author = this.storageH.getID().toString();
    console.log("Message Out: conv=" + this.msgOut.conv + " message=" + this.msgOut.message + " author=" + this.msgOut.author);
    if (this.msgOut) {
      //Api connections
      this.authService.postData(this.msgOut, "sendMessage").then((result) => {
        var respose: any = result;
        if (respose) {
          console.log("Message Nr." + respose.total + " \"" + this.msgOut.message + "\" send from " + this.msgOut.author);
          this.msgOut.message = "";
          this.displayMessages();
          if (this.currentScrollPosition > 209) {
            console.log("scrolling to bottom");
            this.scrollTo(0, this.ContentHeight, 1);
          }
        }
        else {
          console.log("Not found!");
        }
      }, (err) => {
        //Connection failed message
        this.presentToast("Connection failed. Error: "+err);
        });
    }
    else {
      this.presentToast("Messgage not send. Try again!");
    }
  }

 //UP TO DATE
  //check for new messages on reloading
  deltaMsg() {
    var userData = {"conv": "","oldId": "" };
    userData.conv = this.storageH.getConv(this.item);
    userData.oldId = this.displayedMessages.toString();
    if (userData) {
      //Checkt ob die derzeitig angezeigt Anzahl an Messages der Anzahl an Messages auf dem Server entspricht
      this.authService.postData(userData, "deltaMsg").then((result) => {
        var response: any = result;
        if (response) {
          if (response == 1) {
            this.notify();
            //this.contentHeight();
            console.log("NEW MESSAGE BY FRIEND");
            this.reload = true;
          } else {
            this.reload = false;
          }
        }
      }, (err) => {
          //Connection failed message
          this.presentToast("Connection failed. Error: " + err);
        });
      }
    else {
      this.presentToast("Messgage not send. Try again!");
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  notify() {
    this.localNotifications.schedule({
      title: 'Nuntius',
      text: 'Du hast neue Nachrichten!',
      led: '0000FF',
    });
   }
}
