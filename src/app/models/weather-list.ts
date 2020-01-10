import { WeatherRangeItem } from './weather-list-item';

export interface WeatherList {
  cnt: number;
  cod: string;
  list: WeatherRangeItem[];
  message: number;
}
