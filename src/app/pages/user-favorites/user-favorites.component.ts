import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from 'src/app/models/interface/user.interface';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-user-favorites',
  templateUrl: './user-favorites.component.html',
  styleUrls: ['./user-favorites.component.scss']
})
export class UserFavoritesComponent implements OnInit {

  users: User[]=[];
  isUsers=true;
  constructor(private fireSrv: FirebaseService,private route: Router) { }
  ngOnInit(): void {
    this.fireSrv.getAllUsers().subscribe(data => {
      const user = (JSON.parse(localStorage.getItem('user'))as User);
      this.users= [];
      data.forEach(element => {
        user.likes.forEach(element2 => {
          if(element.uid === element2){
            this.users.push(element);
          }
        });
      });
      this.isUsers=false;
    });
  }

  showDetailUser(user){
    this.route.navigate(['users-details',{data:JSON.stringify(user)}]);
  }

}
