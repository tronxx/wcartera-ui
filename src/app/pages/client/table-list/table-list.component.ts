import { Component, OnInit } from '@angular/core';
import { TableOptions } from '@models/table-options';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {

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
    edit: true,
    delete: true,
    create: true,
    download: false,
    size: 0
  }

  constructor() { }

  ngOnInit(): void {
  }

}
