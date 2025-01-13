import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterContentInit } from '@angular/core';
import { ClientesService } from '@services/clientes.service';
import { Form, FormBuilder, FormGroup, FormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from '@angular/material/card';

import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { MatIcon } from '@angular/material/icon';
import { TableOptions } from '@models/table-options';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Vencimientos } from '@models/index';

@Component({
  selector: 'app-vencimientos',
  templateUrl: './vencimientos.component.html',
  styleUrls: ['./vencimientos.component.scss']
})
export class VencimientosComponent implements OnInit {

  @Input() public  vencimientos: Vencimientos[];
  @Input() public  nulets: number;
  fecha = "";

  constructor(
    public builder : UntypedFormBuilder,
    private datePipe : DatePipe,
    public router: Router
    ) { }

  ngOnInit(): void {
    this.fecha =  this.datePipe.transform(new Date(),"yyyy-MM-dd");
    // console.log("Vencimientos componentes", this.vencimientos);

  }

  esvencido (vence: string) {
    return (this.fecha > vence);
  }

  esporvencer (vence: string) {
    return (this.fecha < vence);
  }

 
}
