import { EventEmitter } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { Message } from "@models/message";


export class Form<T>{

    public form : UntypedFormGroup;
    public data : T;
    public submitData : EventEmitter<T>;
    public exit : EventEmitter<boolean>;
    public upload : boolean = false;
    public message : Message;

    submit() : void {
        this.upload = !this.upload;
        let contentData = { ...(this.data? this.data : null), ...this.form.value }
        this.submitData.emit(contentData);
    }

    cancel() : void {
        this.exit.emit(true);
    }

}
