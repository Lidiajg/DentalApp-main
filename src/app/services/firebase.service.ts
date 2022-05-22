/* eslint-disable @angular-eslint/contextual-lifecycle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  private usersCollecitons: AngularFirestoreCollection<any>;
  user: any;

  updateImage: Subject<boolean> = new Subject();
  updateData: Subject<boolean> = new Subject();
  constructor(
    private afStore: AngularFirestore,
    private storage: AngularFireStorage,
    private authSrv: AuthService
  ) {
    this.usersCollecitons = this.afStore.collection('users');
  }
  updateUser(user: any) {
    this.user = JSON.parse(localStorage.getItem('user'));
    const userRef = this.usersCollecitons.doc<any>(user.uid).set({
      name: user.name,
      lastname: user.lastname,
      type: user.type,
      email: this.user.email,
      uid: this.user.uid,
      image: this.user.image,
      likes: this.user.likes,
    });
    userRef.then(() => {
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...user,
          image: this.user.image,
          uid: this.user.uid,
          email: this.user.email,
          likes: this.user.likes,
        })
      );
      this.updateData.next(true);
      this.authSrv.updateUser.next(true);
    });
  }
  updateUserImage(uid: any, image: any) {
    this.user = JSON.parse(localStorage.getItem('user'));
    const filePath = `images/${uid}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.ref(filePath).putString(image, 'data_url');
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            const userRef = this.usersCollecitons.doc<any>(uid).set({
              name: this.user.name,
              lastname: this.user.lastname,
              type: this.user.type,
              email: this.user.email,
              uid: this.user.uid,
              likes: this.user.likes,
              image: url,
            });
            userRef.then(() => {
              const newUser = {
                uid: this.user.uid,
                name: this.user.name,
                email: this.user.email,
                lastname: this.user.lastname,
                type: this.user.type,
                likes: this.user.likes,
                image: url,
              };
              localStorage.setItem('user',JSON.stringify(newUser));
              this.authSrv.updateUser.next(true);
              this.updateImage.next(true);
            });
          });
        })
      )
      .subscribe();
  }

  getAllUsers() {
    return this.usersCollecitons.valueChanges();
  }

  setLikes(uid: any, likesUid: string) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.user.likes.push(likesUid);
    console.log(this.user.likes,uid,likesUid);
    const userRef = this.usersCollecitons.doc<any>(uid).update({
      likes: this.user.likes,
    });
    userRef.then(() => {
      localStorage.setItem('user',JSON.stringify(this.user));
      this.updateData.next(true);
    });
  }

  unsetLikes(uid: any, unlikeid: any) {
    this.user = JSON.parse(localStorage.getItem('user'));
    const index = this.user.likes.indexOf(unlikeid);
    if (index > -1) {
      this.user.likes.splice(index, 1);
    }
    const userRef = this.usersCollecitons.doc<any>(uid).update({
      likes: this.user.likes,
    });
    userRef.then(() => {
      localStorage.setItem('user',JSON.stringify(this.user));
      this.updateData.next(true);
    });
  }
}
