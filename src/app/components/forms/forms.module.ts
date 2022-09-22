import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { RegisterFormComponent } from './auth/register-form/register-form.component';
import { RecoverFormComponent } from './auth/recover-form/recover-form.component';

// Material imports
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const forms = [
  LoginFormComponent,
  RegisterFormComponent,
  RecoverFormComponent
]

const materialImports = [
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatProgressSpinnerModule
]

@NgModule({
  declarations: [
    ...forms
  ],
  imports: [
    CommonModule,
    ...materialImports,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    ...forms
  ]
})
export class FormsModule { }
