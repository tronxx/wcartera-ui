import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { PageIndex } from '@models/page-index';
import { TableOptions } from '@models/table-options';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit {

  @Output() create = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() download = new EventEmitter<any>();
  @Output() select = new EventEmitter<any>();
  @Output() pageIndex = new EventEmitter<PageIndex>();

  @Input() headers : Array<string>;
  @Input() bodyProps : Array<string>;
  @Input() body : Array<any>;
  @Input() options : TableOptions;
  @Input() tableName : string;
  public displayColumns : Array<string> = ['options'];
  @ViewChild(MatPaginator) public paginator : MatPaginator;
  public visibleData : Array<any>;
  public page : PageIndex;

  objselected : any;
  selected : number;

  constructor( ) { }
  ngAfterViewInit(): void {
    this.paginator.page.subscribe((event : PageIndex) => {
      event.pageIndex += 1;
      event.previousPageIndex += 1;
      this.page = event;
      if(event.pageIndex > event.previousPageIndex && this.getHighestId() < (this.page.pageIndex * this.page.pageSize))
        this.pageIndex.emit(event);
      else
        this.setNewPage();
    })
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.options) this.setTableConfigs()
    if(changes.body && !changes.options) this.setNewPage();
  }

  private setTableConfigs(){
    if(this.bodyProps && (this.options.edit || this.options.delete))
      this.displayColumns = [...this.bodyProps, ...this.displayColumns,]; 
    else 
      this.displayColumns = this.bodyProps
      this.visibleData = this.body;
  }

  private setNewPage(){
    let hid = this.getHid()
    let lid = this.getLid(hid);
    let aux : Array<any> = this.body.filter(element => {
      if(element.id >= lid && element.id <= hid )
        return element;
    });
    this.visibleData = aux;
  }

  // Hid stands for Higher Index
  private getHid() : number{
    return this.page.pageIndex * this.page.pageSize;
  }

  // Lid stands for lower index
  private getLid(Hid : number) : number {
      return Hid - this.page.pageSize + 1;
  }

  private getHighestId(){
    let highestId = 0;
    this.body.forEach(element => {
      if(element.id > highestId)
        highestId = element.id;
    });
    return highestId;
  }

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

  openDownload(object : any){
    this.download.emit(object);
  }


  openSelected(object : any){
    if(this.options.signal)
      this.select.emit(object);
  }
}

