import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  showValidationErrors (form: FormGroup, field: string, errorCode?: string) {
    const errors: string[] | null = form.get(field).errors ? Object.keys(form.get(field).errors) : null;

    if (errors && errors[0] !== errorCode) {
      return false;
    }

    return errorCode && errors ?
      form.get(field).errors[errorCode] && form.get(field).touched :
      form.get(field).invalid && form.get(field).touched;
  }
}
