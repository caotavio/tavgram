import { Component, OnInit } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  posts: Observable<any[]>;

  constructor(
    db: AngularFirestore,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
  ) {
    this.posts = db.collection('posts').valueChanges();
  }

  ngOnInit() {
    const img = localStorage.getItem('tavgram.post');
    if (img) {
      this.showMessage('You have an unsaved publication')
    }
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message, duration: 3000, buttons: [
        {
          icon: "send",
          handler: () => {
            this.navCtrl.navigateForward("/post");
          }
        }
      ]
    });
    toast.present();
  }

}
