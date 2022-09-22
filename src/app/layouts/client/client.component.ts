import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  public toggle : boolean;
  public opened : boolean;

  constructor() {
    this.toggle = false;
  }

  ngOnInit(): void {
  }

  toggleSidebar(value : boolean | any){
    this.toggle = !this.toggle;
  }

  close(){
    this.toggle = false;
  }
}
