import { Component, OnInit } from '@angular/core';
import { InfoCard } from '@models/info-card';
import { ChartConfiguration, ChartOptions } from 'chart.js';

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

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
        fill: true,
        tension: 0.5,
        borderColor: '#aaf',
        backgroundColor: '#77cc66'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series A',
      },
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series B',
      }
    ]
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true
  };
  public barChartLegend = true;
  
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
      }
    ]
  };
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true
  };
  public pieChartLegend = true;

  constructor() { }

  ngOnInit(): void {
  }

}
