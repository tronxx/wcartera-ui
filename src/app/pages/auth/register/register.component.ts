import { Component, OnInit } from '@angular/core';
import { EmailRegisterDto } from '@dtos/email-register-dto';
import { Message } from '@models/message';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public message : Message;

  constructor() { }

  ngOnInit(): void {
  }

  registerAccount(data : EmailRegisterDto | any) {
    setTimeout(() => {
      this.message = {
        name: "error",
        message: "the register process could not be processed successfully"
      }
    }, 1000);
  }
}
