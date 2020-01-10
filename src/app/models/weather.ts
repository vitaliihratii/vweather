export interface CurrentWeather {
  base: string;
  clouds: {
    all: number;
  };
  cod: number;
  coord: {
    lon: number;
    lat: number;
  };
  dt: number;
  id: number;
  main: MainWeatherParams;
  name: string;
  sys: SecondaryWeatherParams;
  timezone: number;
  visibility: number;
  weather: WeatherType[];
  wind: Wind;
}

export interface GeneralWeatherData {
  main: MainWeatherParams;
  weather: WeatherType;
}

export interface MainWeatherParams {
  temp: number;
  pressure: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
}

export interface WeatherType {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed: number;
  deg: number;
}

interface SecondaryWeatherParams {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}
