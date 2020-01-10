import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathRoundPipe } from './pipes/math-round.pipe';
import { StoreModule } from '@ngrx/store';
import { appReducers, appMetaReducers } from './store/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { environment } from 'src/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { EntityDataModule } from '@ngrx/data';
import { AuthEffects } from './store/effects/auth.effects';

@NgModule({
  declarations: [MathRoundPipe],
  imports: [
    CommonModule,
    StoreModule.forRoot(appReducers, {
      metaReducers: appMetaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        // strictActionSerializability: true,
        strictStateSerializability: true
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal
    }),
    EffectsModule.forRoot([AuthEffects]),
    EntityDataModule.forRoot({})
  ],
  exports: [
    MathRoundPipe
  ]
})
export class CoreModule { }
