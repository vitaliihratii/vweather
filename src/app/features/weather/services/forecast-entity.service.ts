import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { ForecastItem } from 'src/app/models/forecast';


@Injectable()
export class ForecastEntityService extends EntityCollectionServiceBase<ForecastItem> {

  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Forecast', serviceElementsFactory);
  }

}
