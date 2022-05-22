/* eslint-disable @typescript-eslint/ban-types */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: any[];
  isUsers=true;
  constructor(private fireSrv: FirebaseService,private route: Router) { }

  ngOnInit(): void {
    this.fireSrv.getAllUsers().subscribe(data => {
      this.users = data;
      this.isUsers=false;
    });
  }

  showDetailUser(user){
    this.route.navigate(['users-details',{data:JSON.stringify(user)}]);
  }

}
