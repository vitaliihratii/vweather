import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormControlComponent } from './components/base-form-control/base-form-control.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';



@NgModule({
  declarations: [CheckboxComponent],
  imports: [
    CommonModule
  ],
  exports: [
    CheckboxComponent
  ]
})
export class SharedModule { }
