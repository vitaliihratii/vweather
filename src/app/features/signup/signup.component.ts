import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, Observable, merge } from 'rxjs';
import { withLatestFrom, switchMap, retryWhen, tap, filter, catchError, delay, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state';
import { signup } from 'src/app/core/store/actions/auth.actions';
import { userErrorSelector } from 'src/app/core/store/selectors/auth.selectors';
import { FormService } from 'src/app/core/services/form.service';

@Component({
  selector: 'vwe-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUp$: Observable<any>;
  authForm: FormGroup;
  submitSignUp = new Subject();
  errMsgSubj = new Subject();
  errMsg$: Observable<any>;
  showErrors: (f: FormGroup, field: string, err?: string) => boolean;

  constructor(
    private store: Store<AppState>,
    private formS: FormService
  ) {
    this.showErrors = this.formS.showValidationErrors;
  }

  ngOnInit () {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/.{2,}@.{1,}\..{2,}/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.signUp$ = this.submitSignUp.pipe(
      withLatestFrom(this.authForm.valueChanges),
      tap(([ev, value]) => this.authForm.markAllAsTouched()),
      filter(([ev, value]) => this.authForm.valid),
      tap(([ev, value]) => this.store.dispatch(signup({ email: value.email, password: value.password }))),
    );

    this.errMsg$ = this.store.pipe(
      select(userErrorSelector),
      filter(state => !!state),
      tap(err => this.errMsgSubj.next(err))
    );

  }

}
