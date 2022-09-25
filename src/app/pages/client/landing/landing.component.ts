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
    },
    {
      color : "#e53935",
      description: "Este mes hemos tenido alrededor de 25 tickets se servicio",
      footer : "actualizado hace 24 horas",
      icon : "warning",
      title : "Tickets de servicio"
    },
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
        tension: 0,
        borderColor: '#fff',
        backgroundColor: 'rgba(255,255,255,.6)',
        pointBackgroundColor: "#fff"
      }
    ],
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      yAxes: {
        ticks: {
          color : "#fff"
        },
        grid: {
          color: "rgba(255,255,255, 0.5)"
        }
      },
      xAxes: {
        ticks: {
          color : "#fff"
        },
        grid: {
          color: "rgba(255,255,255, 0.5)"
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "#fff"
        },
      },
    },
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
        backgroundColor: "rgba(200,255,190,0.5)"
      },
      {
        data: [ 65, 59, 80, 81, 56, 55, 40 ],
        label: 'Series B',
        backgroundColor: "rgba(255,255,255,0.5)"
      }
    ],
  };
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff"
        }
      },
    },
    scales: {
      yAxes: {
        ticks: {
          color : "#fff"
        },
        grid: {
          color: "rgba(255,255,255, 0.5)"
        }
      },
      xAxes: {
        ticks: {
          color : "#fff"
        },
        grid: {
          color: "rgba(255,255,255, 0.5)"
        }
      }
    },
  };
  public barChartLegend = true;
  
  public line2ChartData: ChartConfiguration<'line'>['data'] = {
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
        tension: 0.1,
        borderColor: '#fff',
        backgroundColor: 'rgba(255,255,255,.6)',
        pointBackgroundColor: "#fff"
      }
    ],
  };
  public line2ChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      yAxes: {
        ticks: {
          color : "#fff"
        },
        grid: {
          color: "rgba(255,255,255, 0.5)"
        }
      },
      xAxes: {
        ticks: {
          color : "#fff"
        },
        grid: {
          color: "rgba(255,255,255, 0.5)"
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "#fff"
        }
      },
    }
  };
  public line2ChartLegend = true;
  constructor() { }

  ngOnInit(): void {
  }

}
