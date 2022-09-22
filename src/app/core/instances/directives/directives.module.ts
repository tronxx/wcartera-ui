import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropzoneDirective } from './dropzone/dropzone.directive';

const directives = [
  DropzoneDirective
]

@NgModule({
  declarations: [
    ...directives
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...directives
  ]
})
export class DirectivesModule { }
