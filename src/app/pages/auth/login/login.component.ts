import { Component, OnInit } from '@angular/core';
import { EmailLoginDto } from '@dtos/email-login-dto';
import { Message } from '@models/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public message: Message;

  constructor() {}

  ngOnInit(): void {
  }

  signWithEmailAndPassword(data : EmailLoginDto){
    setTimeout(() => {
      this.message = { name : "error", message: "the login is not available right now"}
    }, 2100);
  }
}
