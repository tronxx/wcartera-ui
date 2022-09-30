import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  toggle : boolean;
  opened : boolean;
  showShadow : boolean = true;

  constructor(
    private breakpoint : BreakpointObserver
  ) {
    this.toggle = true;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.breakpoint.observe(['(max-width: 800px)']).subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
          this.showShadow = false;
          this.sidenav.position = "end";
        } else {
          this.sidenav.mode = "side"
          this.sidenav.position = "start"
          this.sidenav.open();
          this.showShadow = true;
        }
      })
    }, 0);
  }

  ngOnInit(): void {
  }

  toggleSidebar(){
    this.toggle = !this.toggle;
  }

  close(){
    this.toggle = false;
  }
}
