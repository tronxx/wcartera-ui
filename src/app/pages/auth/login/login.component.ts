import { Component, OnInit } from '@angular/core';
import { EmailLoginDto } from '@dtos/email-login-dto';
import { Message } from '@models/message';
import { ConfigService } from '../../../services/config.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public message: Message;

  constructor(
    private loginservice : LoginService
  ) {}

  ngOnInit(): void {
  }

  async signWithEmailAndPassword(data : EmailLoginDto){
    const usr = await this.loginservice.login(data.email, data.password);
    console.log(" login component: Usuario", usr);
    setTimeout(() => {
      this.message = { name : "error", message: "the login is not available right now"}
    }, 2100);
  }
}
