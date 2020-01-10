import { Component, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { WeatherEntityService } from '../services/weather-entity.service';
import { City } from 'src/app/models/city';
import { first, withLatestFrom, tap, filter, map } from 'rxjs/operators';

@Component({
  selector: 'vwe-home-weather',
  templateUrl: './home-weather.component.html',
  styleUrls: ['./home-weather.component.css']
})
export class HomeWeatherComponent implements OnInit {

  cities: Observable<City[]>;

  constructor(
    private wes: WeatherEntityService
  ) { }

  ngOnInit() {
    this.cities = this.wes.entities$;
  }
}
