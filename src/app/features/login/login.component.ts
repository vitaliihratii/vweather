import { Component, OnInit } from '@angular/core';
import { Observable, Subject, NEVER, EMPTY } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state';
import { withLatestFrom, switchMap, tap, filter, map, catchError, delay } from 'rxjs/operators';
import { signin } from 'src/app/core/store/actions/auth.actions';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormService } from 'src/app/core/services/form.service';

@Component({
  selector: 'vwe-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signIn$: Observable<any>;
  authForm: FormGroup;
  submitSignIn = new Subject();
  errMsgSubj: Subject<string> = new Subject();
  errMsg$: Observable<string>;
  showErrors: (f: FormGroup, field: string, err?: string) => boolean;

  constructor(
    private store: Store<AppState>,
    private formS: FormService,
    private authS: AuthService
  ) {
    this.showErrors = this.formS.showValidationErrors;
  }

  ngOnInit () {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/.{2,}@.{1,}\..{2,}/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.signIn$ = this.submitSignIn.pipe(
      withLatestFrom(this.authForm.valueChanges),
      tap(_ => this.authForm.markAllAsTouched()),
      filter(_ => this.authForm.valid),
      switchMap(([ev, formValue]) => this.authS.signIn(formValue)),
      // map(user => Object.assign({}, user)),
      tap(user => this.store.dispatch(signin({ user }))),
      catchError((err, source) => {
        this.errMsgSubj.next(err);
        return source;
      }),
    );

    this.errMsg$ = this.errMsgSubj.pipe(
      filter(msg => !!msg),
      delay(5000),
      tap(_ => this.errMsgSubj.next(''))
    );
  }

}
