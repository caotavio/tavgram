import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.models';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ToastController, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  public post: Post = new Post('', '', null);
  public filters: string[] = [];

  public task: AngularFireUploadTask;
  public progress: any;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    const data = localStorage.getItem('tavgram.post');
    if (data) {
      this.post = JSON.parse(data);
    }

    this.filters.push('filter-normal');
    this.filters.push('filter-1977');
    this.filters.push('filter-aden');
    this.filters.push('filter-gingham');
    this.filters.push('filter-ginza');
    this.filters.push('filter-moon');
    this.filters.push('filter-reyes');
    this.filters.push('filter-willow');
  }

  getLocation() {
    // https://www.google.com/maps/{{ this.post.location }}
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.post.location = `${position.coords.latitude},${position.coords.longitude}`;
        localStorage.setItem('tavgram.post', JSON.stringify(this.post));
      });
    } else {
      this.showMessage('We could not get your location =(');
    }
  }

  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present;
  }

  async showCloseOptions() {
    const alert = await this.alertCtrl.create({
      header: 'Discard Post?',
      message: 'Do you wish to discard this <strong>post</strong>?',
      buttons: [
        {
          text: 'Discard',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            localStorage.removeItem('tavgram.post');
            this.close();
          }
        }, {
          text: 'Keep',
          handler: () => {
            this.close();
          }
        }
      ]
    });

    await alert.present();
  }

  close() {
    this.navCtrl.navigateBack('/home');
  }

  saveLocal() {
    localStorage.setItem('tavgram.post', JSON.stringify(this.post));
  }

  submit() {
    const filePath = `post_${new Date().getTime()}.jpg`;

    this.task = this.storage.ref(filePath).putString(this.post.image, 'data_url');
    this.progress = this.task.percentageChanges();

    this.task.then((data) => {
      const ref = this.storage.ref(data.metadata.fullPath);
      ref.getDownloadURL().subscribe((imgUrl) => {
        this.post.image = imgUrl;
        this.db.collection('posts').add(this.post);
        localStorage.removeItem('tavgram.post');
        this.navCtrl.navigateBack('/home');
      });
    });
  }

  showMap() {
    this.navCtrl.navigateForward('/map');
  }
}
