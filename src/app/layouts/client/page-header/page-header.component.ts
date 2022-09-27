import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  public route : string;

  constructor(
    private router : Router
  ) { }

  ngOnInit(): void {
    let subRoute = this.router.url.split("/")
    environment.menu.forEach(element => {if(element.url == subRoute[2]) this.route = element.name});
  }

  trackNavigation(){
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        let subRoute = this.router.url.split("/")
        environment.menu.forEach(element => {if(element.url == subRoute[2]) this.route = element.name});
      }
    })
  }

}
