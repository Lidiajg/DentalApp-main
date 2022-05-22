import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { User } from 'src/app/models/interface/user.interface';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  rolSubs$: Subscription;
  isLoged = false;
  isPatient = false;
  isDentist = false;
  user: User;
  constructor(private router: Router, private authSrv: AuthService) {
  }
  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.isLoged = true;
      this.user = JSON.parse(localStorage.getItem('user')) as User;
    }
    this.authSrv.updateUser.subscribe({
      next: (islogin: boolean) => {
        if (islogin) {
          this.isLoged = true;
          this.user = JSON.parse(localStorage.getItem('user')) as User;
        } else {
          this.isLoged = false;
          this.user = null;
        }
      },
    });
  }

  getArgumentosRuta() {
    return this.router.events.pipe(
      filter(
        (event: any) =>
          event instanceof ActivationEnd &&
          event.snapshot.firstChild === null &&
          event.snapshot.queryParams != null
      ),
      map((event: ActivationEnd) => event.snapshot.queryParams)
    );
  }

  logOut() {
    this.authSrv.logOut();
  }

  userProfile() {
    this.router.navigate(['/profile']);
  }

  isListLikes(): boolean {
    let retorno = false;
    if (this.user && this.user.likes) {
      retorno = true;
    }
    return retorno;
  }
}
