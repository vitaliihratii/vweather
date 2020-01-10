import { Routes } from '@angular/router';
import { HomeWeatherComponent } from './home-weather/home-weather.component';
import { DetailedWeatherComponent } from './detailed-weather/detailed-weather.component';
import { AddCityComponent } from './add-city/add-city.component';
import { DetailedWeatherResolver } from './services/detailed-weather.resolver';
import { CityResolver } from './services/city.resolver';

export const WEATHER_ROUTES: Routes = [
  { path: '', component: HomeWeatherComponent, resolve: { cities: CityResolver } },
  { path: 'add-city', component: AddCityComponent, resolve: { cities: CityResolver } },
  { path: ':cityToken', component: DetailedWeatherComponent, resolve: { forecast: DetailedWeatherResolver } },
];
