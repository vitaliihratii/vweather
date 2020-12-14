import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { HomeWeatherComponent } from './home-weather/home-weather.component';
import { WeatherCardComponent } from './weather-card/weather-card.component';
import { DetailedWeatherComponent } from './detailed-weather/detailed-weather.component';
import { AddCityCardComponent } from './add-city-card/add-city-card.component';
import { AddCityComponent } from './add-city/add-city.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { EntityDefinitionService, EntityDataService, EntityMetadataMap, EntityCacheDataService } from '@ngrx/data';
import { WeatherDataService } from './services/weather-data.service';
import { ForecastDataService } from './services/forecast-data.service';
import { WeatherEntityService } from './services/weather-entity.service';
import { ForecastEntityService } from './services/forecast-entity.service';
import { DetailedWeatherResolver } from './services/detailed-weather.resolver';
import { ForecastItem } from 'src/app/models/forecast';
import { SharedModule } from 'src/app/shared/shared.module';
import { CityCacheDataService } from './services/city-cache-data.service';

const entityMetaData: EntityMetadataMap = {
  City: {
    entityDispatcherOptions: {
      optimisticAdd: true,
      optimisticDelete: true
    }
  },
  Forecast: {
    selectId: weather => weather.city,
    filterFn: (entts: ForecastItem[], pattern: {city: string}) => entts.filter(forecast => forecast.city === pattern.city)
  }
};

@NgModule({
  declarations: [HomeWeatherComponent, WeatherCardComponent, DetailedWeatherComponent, AddCityCardComponent, AddCityComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    RouterModule
  ],
  providers: [
    WeatherEntityService,
    ForecastEntityService,
    WeatherDataService,
    ForecastDataService,
    DetailedWeatherResolver,
    { provide: EntityCacheDataService, useClass: CityCacheDataService }
  ]
})
export class WeatherModule {
  constructor(
    private eds: EntityDefinitionService,
    private edataS: EntityDataService,
    private wds: WeatherDataService,
    private fds: ForecastDataService
  ) {

    this.eds.registerMetadataMap(entityMetaData);
    this.edataS.registerServices({
      'City': this.wds,
      'Forecast': this.fds
    });
  }
}
