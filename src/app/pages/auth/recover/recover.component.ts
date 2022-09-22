import { Component, OnInit } from '@angular/core';
import { EmailRecoverDto } from '@dtos/email-recover-dto';
import { Message } from '@models/message';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

  public message : Message;

  constructor() { }

  ngOnInit(): void {
  }

  submit(data: EmailRecoverDto | any){
    console.log(data);
    setTimeout(() => {
      this.message = {
        name: "error",
        message: "the recover email was not sent due to internal errors, please retry later"
      }
    }, 1000);
  }
}
