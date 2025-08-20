import { Component, OnInit } from '@angular/core';
import { InfoCard } from '@models/info-card';
import { TableOptions } from '@models/table-options';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public cards : Array<InfoCard> = [
    {
      color : "linear-gradient(60deg,#66bb6a,#43a047)",
      description: "En el último mes se han generado más de 3500 dólares de ganancia",
      footer : "haz click para ver más",
      icon : "shopping_cart",
      title : "Las ventas del último mes",
      footerLink : "#"
    },
    {
      color : "linear-gradient(60deg,#ffa726,#fb8c00)",
      description: "Los seguidores de este mes se han mantenido constantes y sonantes",
      footer : "Los seguidores son constantes",
      icon : "groups",
      title : "Seguidores en redes sociales",
    },
    {
      color : "linear-gradient(60deg, #56cfaf, #57dfbf)",
      description: "Este mes las promociones han tenido leads del 80%",
      footer : "promos simples, grandes ganancias",
      icon : "sell",
      title : "Promociones"
    },
    {
      color : "linear-gradient(60deg,#ef5350,#e53935)",
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
        data: [ 35, 59, 40, 91, 46, 65, 70 ],
        label: 'Series A',
        fill: true,
        tension: 0.5,
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
        data: [ 65, 59, 80, 45, 56, 55, 40 ],
        label: 'Series A',
        backgroundColor: "rgba(200,255,190,0.5)"
      },
      {
        data: [ 59, 65, 28, 81, 56, 35, 70 ],
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

  public contextualMenu : string = "";
  public pendantTickets : Array<any> = [
    {
      completed: false,
      description: "the table does not change of page correctly"
    },
    {
      completed: false,
      description: "the sidebar does not collapse under 800px of width of resolution"
    },
    {
      completed: true,
      description: "The navbar menu button does not open on command"
    }
  ]
  public dailyTasks : Array<any> = [
    {
      completed: false,
      description : "buy milk"
    },
    {
      completed: false,
      description : "fire that useless employee"
    },
    {
      completed: false,
      description : "buy amazon stock"
    },
    {
      completed: false,
      description : "sell google stock"
    },
    {
      completed: true,
      description : "buy new macbooks for all my employees"
    },
  ]
  public dailyAdvances : Array<any> = [
    {
      completed: false,
      description: "do exercise"
    },
    {
      completed: false,
      description: "drink 2 liters of water"
    },
    {
      completed: true,
      description: "do the daily standup"
    }
  ]

  public headers : Array<string> = ["id", "fecha", "descripcion"]
  public arrayContent : Array<string> = ["id", "date", "description"];
  public body : Array<any> = [
    {
      id : "1",
      date:  "12-12-22 12:32:00",
      description: "la creación exitosa de un nuevo producto"
    },
    {
      id : "2",
      date:  "23-12-22 15:56:00",
      description: "the coca cola company bought the company"
    },
    {
      id : "3",
      date:  "26-12-22 18:23:00",
      description: "the ceo of dout was fired"
    },
  ];
  public tableOptions : TableOptions = {
    edit: false,
    delete: false,
    create: false,
    download: false,
    size: 0
  }

  version= "1.02f";
  versiones = [
    "19-Ago-2025 1.02d se corrige la forma de pago en la factura, se agrega el debug en la factura, se corrige el timbrado de la factura, se agrega el debug en la factura, se corrige el timbrado de la factura, se agrega el debug en la factura, se corrige el timbrado de la factura, se agrega el debug en la factura, se corrige el timbrado de la factura, se agrega el debug en la factura, se corrige el timbrado de la factura",
    "19-Ago-2025 1.02e se agrega un diálogo que pregunta si se quiere cerrar la factura, se agrega el debug en la factura, se corrige el timbrado de la factura, se agrega el debug en la factura, se corrige el timbrado de la factura, se agrega el debug en la factura, se corrige el timbrado de la factura, se agrega el debug en la factura, se corrige el timbrado de la factura",
    "20-Ago-2025 1.02f se corrige el timbrado de la factura para tener header application/json y que se grabe correctamente la solicitud",
  ];
  
  constructor() { }

  ngOnInit(): void {
    this.updateContextualMenu('tickets-list');
  }

  updateContextualMenu(context : 'daily-advances' | 'daily-tasks' | 'tickets-list'){
    this.contextualMenu= context;
  }
}
