import { Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { APP_ROUTES_NAMES } from './app.routes.names';
import { LoginComponent } from './features/login/login.component';
import { WEATHER_ROUTES } from './features/weather/weather.routes';
import { SignupComponent } from './features/signup/signup.component';
import { AuthGuard } from './core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: APP_ROUTES_NAMES.HOME,
    component: HomeComponent,
    canActivateChild: [AuthGuard],
    children: WEATHER_ROUTES
      // { path: '', component: HomeStartComponent }
      // { path: printerRoutesNames.PRINTERS, loadChildren: () => import('./movies/movie.module').then(m => m.MovieModule), canLoad: [AuthGuard] },
      // { path: adminRoutesNames.OTHER, children: OTHER_ROUTES },
    
  },
  { path: APP_ROUTES_NAMES.LOGIN, component: LoginComponent },
  { path: APP_ROUTES_NAMES.SIGNUP, component: SignupComponent },
  { path: '', pathMatch: 'full', redirectTo: APP_ROUTES_NAMES.HOME }
];
