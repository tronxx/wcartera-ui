import { Component, Input, OnInit } from '@angular/core';
import {InfoCard} from '@models/info-card';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {

  public defaultColor = environment.primaryColor
  @Input() infoCard : InfoCard;

  constructor() { }

  ngOnInit(): void {}

}
