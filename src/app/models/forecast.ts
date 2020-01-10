import { City } from './city';
import { WeatherRangeItem } from './weather-list-item';

export interface ForecastItem {
  city: string;
  weather: WeatherRangeItem[];
}
