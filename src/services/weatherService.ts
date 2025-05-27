import { WeatherData, ForecastData } from '../types/weather';

// OpenWeatherMap API key - typically you'd store this in an environment variable
// For demo purposes, we'll use a placeholder API key
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// For demo purposes, using sample data when no API key is provided
const SAMPLE_WEATHER_DATA: WeatherData = {
  coord: { lon: -74.006, lat: 40.7143 },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }
  ],
  base: 'stations',
  main: {
    temp: 22.5,
    feels_like: 21.8,
    temp_min: 20.3,
    temp_max: 24.7,
    pressure: 1015,
    humidity: 53
  },
  visibility: 10000,
  wind: {
    speed: 4.12,
    deg: 240
  },
  clouds: {
    all: 0
  },
  dt: 1627040400,
  sys: {
    type: 2,
    id: 2039034,
    country: 'US',
    sunrise: 1627029063,
    sunset: 1627081880
  },
  timezone: -14400,
  id: 5128581,
  name: 'New York',
  cod: 200
};

// Sample forecast data
const SAMPLE_FORECAST_DATA: ForecastData[] = [
  {
    dt: new Date().getTime() / 1000 + 86400,
    main: {
      temp: 23.2,
      feels_like: 22.8,
      temp_min: 21.1,
      temp_max: 25.6,
      pressure: 1014,
      humidity: 55
    },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }
    ],
    wind: {
      speed: 3.5,
      deg: 230
    },
    visibility: 10000,
    pop: 0
  },
  {
    dt: new Date().getTime() / 1000 + 172800,
    main: {
      temp: 25.8,
      feels_like: 25.4,
      temp_min: 23.2,
      temp_max: 27.9,
      pressure: 1012,
      humidity: 48
    },
    weather: [
      {
        id: 801,
        main: 'Clouds',
        description: 'few clouds',
        icon: '02d'
      }
    ],
    wind: {
      speed: 4.2,
      deg: 245
    },
    visibility: 10000,
    pop: 0.1
  },
  {
    dt: new Date().getTime() / 1000 + 259200,
    main: {
      temp: 24.3,
      feels_like: 24.1,
      temp_min: 22.5,
      temp_max: 26.2,
      pressure: 1010,
      humidity: 60
    },
    weather: [
      {
        id: 500,
        main: 'Rain',
        description: 'light rain',
        icon: '10d'
      }
    ],
    wind: {
      speed: 5.1,
      deg: 260
    },
    visibility: 8000,
    pop: 0.4
  },
  {
    dt: new Date().getTime() / 1000 + 345600,
    main: {
      temp: 22.1,
      feels_like: 21.8,
      temp_min: 20.5,
      temp_max: 23.7,
      pressure: 1013,
      humidity: 65
    },
    weather: [
      {
        id: 501,
        main: 'Rain',
        description: 'moderate rain',
        icon: '10d'
      }
    ],
    wind: {
      speed: 4.8,
      deg: 270
    },
    visibility: 6000,
    pop: 0.6
  },
  {
    dt: new Date().getTime() / 1000 + 432000,
    main: {
      temp: 21.5,
      feels_like: 21.2,
      temp_min: 19.8,
      temp_max: 23.1,
      pressure: 1015,
      humidity: 68
    },
    weather: [
      {
        id: 802,
        main: 'Clouds',
        description: 'scattered clouds',
        icon: '03d'
      }
    ],
    wind: {
      speed: 3.9,
      deg: 250
    },
    visibility: 9000,
    pop: 0.2
  }
];

// Fetch current weather data for a city
export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  // If API key is not provided, return sample data
  if (API_KEY === 'YOUR_API_KEY') {
    console.log('Using sample weather data since no API key is provided');
    return {
      ...SAMPLE_WEATHER_DATA,
      name: city,
      weather: [{
        ...SAMPLE_WEATHER_DATA.weather[0],
        id: Math.random() > 0.5 ? 800 : 801 // Randomly switch between clear and few clouds
      }]
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Fetch 5-day forecast data for a city
export const fetchForecastData = async (city: string): Promise<ForecastData[]> => {
  // If API key is not provided, return sample data
  if (API_KEY === 'YOUR_API_KEY') {
    console.log('Using sample forecast data since no API key is provided');
    return SAMPLE_FORECAST_DATA;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // OpenWeatherMap returns forecast in 3-hour intervals
    // We need to filter to get one forecast per day (at noon)
    const dailyForecasts: ForecastData[] = [];
    const processedDates = new Set();
    
    for (const item of data.list) {
      const date = new Date(item.dt * 1000);
      const dateString = date.toISOString().split('T')[0];
      
      // Only include one forecast per day
      if (!processedDates.has(dateString)) {
        processedDates.add(dateString);
        dailyForecasts.push(item);
        
        // Limit to 5 days
        if (dailyForecasts.length >= 5) {
          break;
        }
      }
    }
    
    return dailyForecasts;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};