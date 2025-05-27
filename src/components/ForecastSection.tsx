import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { fetchForecastData } from '../services/weatherService';
import { ForecastData } from '../types/weather';
import WeatherIcon from './WeatherIcon';
import { Calendar } from 'lucide-react';

interface ForecastSectionProps {
  city: string;
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ city }) => {
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const forecastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getForecast = async () => {
      if (!city) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchForecastData(city);
        setForecast(data);
        
        // Animate forecast items
        if (forecastRef.current && data) {
          gsap.fromTo(
            '.forecast-item',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, delay: 0.2 }
          );
        }
      } catch (err) {
        setError('Failed to fetch forecast data.');
        console.error('Error fetching forecast data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getForecast();
  }, [city]);

  // Format date (e.g., "Mon, 15 Jun")
  const formatDate = (dt: number) => {
    const date = new Date(dt * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div ref={forecastRef} className="weather-data">
      <div className="flex items-center mb-4">
        <Calendar className="mr-2 text-blue-500" size={20} />
        <h3 className="text-xl font-semibold dark:text-white">5-Day Forecast</h3>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      ) : forecast ? (
        <div className="space-y-3">
          {forecast.map((item, index) => (
            <div 
              key={index}
              className="forecast-item flex items-center bg-white dark:bg-gray-800 rounded-lg p-3 
                        shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="w-24 flex-shrink-0">
                <p className="text-sm font-medium dark:text-gray-300">{formatDate(item.dt)}</p>
              </div>
              
              <div className="flex-shrink-0 w-12 h-12 mx-2">
                <WeatherIcon 
                  weatherCode={item.weather[0].id}
                  description={item.weather[0].description}
                />
              </div>
              
              <div className="flex-grow">
                <p className="text-sm capitalize dark:text-gray-300">{item.weather[0].description}</p>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-bold dark:text-white">{Math.round(item.main.temp)}°C</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{Math.round(item.main.temp_min)}° / {Math.round(item.main.temp_max)}°</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 dark:text-gray-400">No forecast data available</p>
        </div>
      )}
    </div>
  );
};

export default ForecastSection;