import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { EmailLoginDto } from '@dtos/email-login-dto';
import { Message } from '@models/message';
import { ConfigService } from '@services/config.service';
import { get } from 'lodash';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends Form<EmailLoginDto> implements OnChanges{

  logindefault = {
    login: "tron.brd.mds@gmail.com",
    pwd: "MOSSIMO"
  }
  debug = false;

  @Output() public submitData: EventEmitter<EmailLoginDto>;
  @Input() public message: Message;

  constructor(
    public builder : UntypedFormBuilder,
    private configService: ConfigService
  ) {
    super();
    this.submitData = new EventEmitter<EmailLoginDto>();
    this.form = this.builder.group({
      email : ["", [Validators.required]],
      password: ["", [Validators.required]]
    });

    this.getDebugMode();
  }

  async getDebugMode() {
    this.debug = await this.configService.getDebug();
    console.log("Debug mode is", this.debug);
    if(this.debug){
      this.email.setValue(this.logindefault.login);
      this.password.setValue(this.logindefault.pwd);
    } else {
      this.password.setValue("****");
      
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.message && this.message.name == "error"){
      this.upload = false;
      this.form.get("email").enable();
      this.form.get("password").enable();
    }
  }

  uploadSign(){
    this.form.get("email").disable();
    this.form.get("password").disable();
    this.submit();
  }

  get email(){
    return this.form.get("email");
  }

  get password(){
    return this.form.get("password");
  }
}
