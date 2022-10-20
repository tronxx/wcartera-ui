import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Form } from '@classes/forms/form';
import { EmailRegisterDto } from '@dtos/email-register-dto';
import { Message } from '@models/message';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent extends Form<EmailRegisterDto> implements OnChanges {

  @Output() public submitData: EventEmitter<EmailRegisterDto> = new EventEmitter<EmailRegisterDto>();
  @Input() public message : Message;

  constructor(
    private builder : UntypedFormBuilder
  ) {
    super();
    this.form = this.builder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      terms: [null, [Validators.required, Validators.requiredTrue]]
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.message && this.message.name == "error"){
      this.upload = false;
    }
  }

}
