import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { EmailRecoverDto } from '@dtos/email-recover-dto';
import { Message } from '@models/message';

@Component({
  selector: 'recover-form',
  templateUrl: './recover-form.component.html',
  styleUrls: ['./recover-form.component.scss']
})
export class RecoverFormComponent extends Form<EmailRecoverDto> implements OnChanges {

  @Output() public submitData : EventEmitter<EmailRecoverDto> = new EventEmitter<EmailRecoverDto>();
  @Input() public message : Message

  constructor(
    private builder: FormBuilder
  ) {
    super();
    this.form = this.builder.group({
      email : ["", [Validators.email, Validators.required]]
    });
  }

  sendRecoverEmail() : void {
    this.email.disable();
    this.submit()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.message.name == "error"){
      this.upload = false;
      this.email.enable();
    }
  }

  get email(){
    return this.form.get("email");
  }

}
