import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { City } from 'src/app/models/city';


@Injectable()
export class WeatherEntityService extends EntityCollectionServiceBase<City> {

  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('City', serviceElementsFactory);
  }

}
