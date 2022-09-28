import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {

  public icons : Array<string> = [
    "search",
    "home",
    "menu",
    "close",
    "settings",
    "expand_more",
    "done",
    "check_circle",
    "favorite",
    "add",
    "delete",
    "arrow_back",
    "star",
    "chevron_right",
    "logout",
    "arrow_forward_ios",
    "add_circle",
    "cancel",
    "arrow_back_ios",
    "file_download",
    "arrow_forward",
    "arrow_drop_down",
    "more_vert",
    "check",
    "check_box",
    "toggle_on"
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
