import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

export interface TableOptions {
  edit : boolean;
  delete : boolean;
  create : boolean;
  pagination : boolean;
  pages : number;
  signal? : boolean;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

  @Output() create = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() select = new EventEmitter<any>();

  @Input() headers : Array<string>;
  @Input() body : Array<any>;
  @Input() options : TableOptions;
  @Input() arrayContent : Array<string>;
  @Input() tableName : string;

  objselected : any;
  selected : number;

  constructor( ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {}

  selectObject(content: any, index : number) {
    this.objselected = content;
    this.selected = index;
    this.select.emit(this.objselected);
  }

  openCreate(){
    this.create.emit(true);
  }

  openEdit(object : any){
    this.edit.emit(object);
  }

  openDelete(object : any){
    this.delete.emit(object);
  }

  openSelected(object : any){
    if(this.options.signal)
      this.select.emit(object);
  }
}
