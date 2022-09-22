import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  public hide : boolean = true;
  @Output() toggle : EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private breakpoint : BreakpointObserver
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
  }

  toggleSidebar(){
    this.toggle.emit(true);
  }
}
