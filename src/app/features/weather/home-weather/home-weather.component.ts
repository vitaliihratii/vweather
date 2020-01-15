import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherEntityService } from '../services/weather-entity.service';
import { City } from 'src/app/models/city';

@Component({
  selector: 'vwe-home-weather',
  templateUrl: './home-weather.component.html',
  styleUrls: ['./home-weather.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
