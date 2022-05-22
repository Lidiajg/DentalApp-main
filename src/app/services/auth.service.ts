/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SweetAlertService } from './sweet-alert.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollecitons: AngularFirestoreCollection<any>;
  imageUrl!: any;
  uploadPercent!: Observable<number>;
  urlImage!: Observable<string>;
  userRegister: Subject<boolean> = new Subject();
  updateUser: Subject<boolean> = new Subject();
  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private sweetAlertSrv: SweetAlertService
  ) {
    this.usersCollecitons = this.afStore.collection('users');
  }

  logIn(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(({user}) => {
        const userLogin = this.usersCollecitons.doc<any>(user.uid).get();
        userLogin.subscribe((user) => {
          if (user.exists) {
            localStorage.setItem('user', JSON.stringify(user.data()));
            this.updateUser.next(true);
            this.router.navigate(['/segundoHome']);
          }
        });
      })
      .catch((resp) => {
        switch (resp.code) {
          case 'auth/user-not-found':
            console.log('El usuario no existe');
            this.sweetAlertSrv.alert('error', 'El usuario no existe', 2000);
            break;
          case 'auth/wrong-password':
            console.log('La contraseña es incorrecta');
            this.sweetAlertSrv.alert('error', 'La contraseña es incorrecta', 2000);
            break;
          case 'auth/invalid-email':
            console.log('El email es invalido');
            this.sweetAlertSrv.alert('error', 'El email es invalido', 2000);
            break;
          default:
            console.log('Error desconocido');
            this.sweetAlertSrv.alert('error', 'Error desconocido', 2000);
            break;
        }
      });
  }
  signIn({ name, lastName, email, password, type, image }) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const filePath = `images/${user.uid}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.ref(filePath).putString(image, 'data_url');
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                this.imageUrl = url;
                const userRef = this.usersCollecitons.doc<any>(user.uid).set({
                  email: user.email,
                  uid: user.uid,
                  name,
                  lastname: lastName,
                  type,
                  image: this.imageUrl,
                  likes: [],
                });
                userRef.then(() => {
                  console.log('Usuario Creado');
                  localStorage.setItem('user', JSON.stringify({
                    email: user.email,
                    uid: user.uid,
                    name,
                    lastname: lastName,
                    type,
                    image: this.imageUrl,
                    likes: [],
                  }));
                  this.updateUser.next(true);
                  this.userRegister.next(true);
                });
              });
            })
          )
          .subscribe();
      })
      .catch((resp) => {
        switch (resp.code) {
          case 'auth/email-already-in-use':
            this.updateUser.next(true);
            console.log('El email ya esta en uso');
            this.userRegister.next(false);
            this.sweetAlertSrv.alert('error', 'El email ya esta en uso', 2000);
            break;
          case 'auth/invalid-email':
            this.updateUser.next(true);
            console.log('El email es invalido');
            this.userRegister.next(true);
            this.sweetAlertSrv.alert('error', 'El email es invalido', 2000);
            break;
          case 'auth/operation-not-allowed':
            this.updateUser.next(true);
            this.userRegister.next(false);
            console.log('No se puede registrar');
            this.sweetAlertSrv.alert('error', 'No se puede registrar', 2000);
            break;
          case 'auth/weak-password':
            this.updateUser.next(true);
            this.userRegister.next(false);
            console.log('La contraseña es muy debil');
            this.sweetAlertSrv.alert('error', 'La contraseña es muy debil', 2000);
            break;
          default:
            this.updateUser.next(true);
            this.userRegister.next(false);
            console.log('Error desconocido', resp);
            this.sweetAlertSrv.alert('error', 'Error desconocido', 2000);
            break;
        }
      });
    }

  logOut(){
    this.afAuth.signOut().then(()=>{
      localStorage.removeItem('user');
      this.updateUser.next(false);
      this.router.navigate(['/signIn']);
    });
  }
}
