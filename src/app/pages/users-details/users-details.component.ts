import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.scss'],
})
export class UsersDetailsComponent implements OnInit {
  user;
  loggedUser;
  like = false;
  constructor(private route: ActivatedRoute, private fireSrv: FirebaseService) {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    this.user = JSON.parse(this.route.snapshot.paramMap.get('data'));
  }

  ngOnInit(): void {
    if (this.loggedUser) {
      this.findUserLiked();
    }
  }

  setLike() {
    if (!this.like) {
      this.fireSrv.setLikes(this.loggedUser.uid, this.user.uid);
    } else {
      this.fireSrv.unsetLikes(this.loggedUser.uid, this.user.uid);
    }
  }

  findUserLiked() {
    this.loggedUser.likes.forEach((element) => {
      if (element === this.user.uid) {
        this.like = true;
      }
    });
  }
}
