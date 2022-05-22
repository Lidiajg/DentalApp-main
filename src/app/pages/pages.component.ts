import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(
        (event: any) =>
          event instanceof ActivationEnd &&
          event.snapshot.firstChild === null &&
          event.snapshot.queryParams != null
      ),
      map((event: ActivationEnd) => event.snapshot)
    ).subscribe();
  }

}
