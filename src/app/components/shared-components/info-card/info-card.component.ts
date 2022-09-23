import { Component, OnInit } from '@angular/core';

type InfoCard = {
  title : string;
  description : string;
  footer : string;
  footerLink? : boolean;
  icon : string;
}

@Component({
  selector: 'info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

}
