import { Wind, WeatherType, MainWeatherParams } from './weather';

export interface WeatherRangeItem {
  clouds: {
    all: number;
  };
  dt: number;
  dt_txt: string;
  main: MainWeatherParamsExt;
  sys: {
    pod: string;
  };
  weather: WeatherType[];
  wind: Wind;
}

interface MainWeatherParamsExt extends MainWeatherParams {
  grnd_level: number;
  sea_level: number;
  temp_kf: number;
}
