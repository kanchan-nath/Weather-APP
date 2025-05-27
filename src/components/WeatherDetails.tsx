import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Thermometer,
  ArrowDown,
  ArrowUp,
  Eye,
  Wind
} from 'lucide-react';
import { WeatherData } from '../types/weather';

interface WeatherDetailsProps {
  weatherData: WeatherData;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weatherData }) => {
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detailsRef.current) {
      gsap.fromTo(
        '.detail-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }
      );
    }
  }, [weatherData]);

  // Convert unix timestamp to local time
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div ref={detailsRef} className="weather-data">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Weather Details</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="detail-card bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <Thermometer className="text-red-500 mr-2" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Feels Like</span>
          </div>
          <p className="text-lg font-medium dark:text-white">{Math.round(weatherData.main.feels_like)}°C</p>
        </div>

        <div className="detail-card bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <Droplets className="text-blue-500 mr-2" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Humidity</span>
          </div>
          <p className="text-lg font-medium dark:text-white">{weatherData.main.humidity}%</p>
        </div>

        <div className="detail-card bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <Wind className="text-teal-500 mr-2" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Wind Speed</span>
          </div>
          <p className="text-lg font-medium dark:text-white">{Math.round(weatherData.wind.speed * 3.6)} km/h</p>
        </div>
        
        <div className="detail-card bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <Gauge className="text-purple-500 mr-2" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Pressure</span>
          </div>
          <p className="text-lg font-medium dark:text-white">{weatherData.main.pressure} hPa</p>
        </div>
        
        <div className="detail-card bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <Eye className="text-blue-400 mr-2" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Visibility</span>
          </div>
          <p className="text-lg font-medium dark:text-white">{(weatherData.visibility / 1000).toFixed(1)} km</p>
        </div>

        <div className="detail-card bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <ArrowDown className="text-blue-500 mr-2" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Min Temp</span>
          </div>
          <p className="text-lg font-medium dark:text-white">{Math.round(weatherData.main.temp_min)}°C</p>
        </div>

        <div className="detail-card bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <ArrowUp className="text-red-500 mr-2" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Max Temp</span>
          </div>
          <p className="text-lg font-medium dark:text-white">{Math.round(weatherData.main.temp_max)}°C</p>
        </div>

        <div className="detail-card bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <Sunrise className="text-orange-500 mr-2" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Sunrise</span>
          </div>
          <p className="text-lg font-medium dark:text-white">{formatTime(weatherData.sys.sunrise)}</p>
        </div>

        <div className="detail-card bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <Sunset className="text-orange-400 mr-2" size={18} />
            <span className="text-sm text-gray-600 dark:text-gray-300">Sunset</span>
          </div>
          <p className="text-lg font-medium dark:text-white">{formatTime(weatherData.sys.sunset)}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;