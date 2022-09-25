import { Component, OnInit } from '@angular/core';
import { InfoCard } from '@models/info-card';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public cards : Array<InfoCard> = [
    {
      color : "#00ff00",
      description: "En el último mes se han generado más de 3500 dólares de ganancia",
      footer : "haz click para ver más",
      icon : "shopping_cart",
      title : "Las ventas del último mes",
      footerLink : "#"
    },
    {
      color : "#6655aa",
      description: "Los seguidores de este mes se han mantenido constantes y sonantes",
      footer : "Los seguidores son constantes",
      icon : "groups",
      title : "Seguidores en redes sociales",
    },
    {
      color : "#56cfaf",
      description: "Este mes las promociones han tenido leads del 80%",
      footer : "promos simples, grandes ganancias",
      icon : "sell",
      title : "Promociones"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
