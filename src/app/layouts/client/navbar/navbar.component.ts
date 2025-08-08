import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  public hide : boolean = true;
  @Output() toggle : EventEmitter<boolean> = new EventEmitter<boolean>();
  public route : string;

  numcia = -1;
  iduser = -1;
  nombre = "";


  constructor(
    private breakpoint : BreakpointObserver,
    private router : Router
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.breakpoint.observe(['(max-width: 800px)']).subscribe((res) => {
        if (res.matches) {
          this.hide = false;
        } else {
          this.hide = true;
        }
      })
    }, 0);
  }

  ngOnInit(): void {
    let subRoute = this.router.url.split("/")
    var mistorage_z  = localStorage.getItem('token') || "{}";
    const micompania_z =  JSON.parse(mistorage_z);
    this.numcia = micompania_z.usuario.cia;
    this.iduser = micompania_z.usuario.iduser;
    this.nombre = micompania_z.usuario.nombre;

    environment.menu.forEach(element => {if(element.url == subRoute[2]) this.route = element.name});
    this.trackNavigation();
  }

  trackNavigation(){
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        let subRoute = this.router.url.split("/")
        environment.menu.forEach(element => {if(element.url == subRoute[2]) this.route = element.name});
      }
    })
  }

  toggleSidebar(){
    this.toggle.emit(true);
  }
}
